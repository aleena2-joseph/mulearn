import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebase';
import { ChevronDown, Plus, Edit2, Trash2, File, Image, X, Calendar, Clock, Users, Mail, Phone, User, Download, Eye } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeSection, setActiveSection] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [viewingRegistrations, setViewingRegistrations] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
      } else {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsCollection = collection(db, 'events');
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    } catch (error) {
      alert('Error fetching events: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventRegistrations = async (eventId) => {
    try {
      setLoadingRegistrations(true);
      const registrationsRef = collection(db, 'eventRegistrations');
      const q = query(registrationsRef, where('eventId', '==', eventId));
      const registrationsSnapshot = await getDocs(q);
      const registrationsList = registrationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRegistrations(registrationsList.sort((a, b) => b.registeredAt?.seconds - a.registeredAt?.seconds));
    } catch (error) {
      alert('Error fetching registrations: ' + error.message);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleViewRegistrations = async (event) => {
    setViewingRegistrations(event);
    await fetchEventRegistrations(event.id);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, GIF, PDF allowed');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File must be under 10MB');
      e.target.value = '';
      return;
    }

    setFormData(prev => ({ ...prev, file }));
  };

  const uploadFile = async (file) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: 'POST',
        body: formDataUpload
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.secure_url) {
        throw new Error('Upload succeeded but no URL returned');
      }

      return {
        downloadURL: data.secure_url,
        fileName: data.public_id || data.asset_id || 'unknown'
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload file to Cloudinary: ' + error.message);
    }
  };

  const handleAddEvent = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    if (!formData.file) {
      alert('Please upload a file');
      return;
    }

    try {
      setLoading(true);

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
      }

      console.log('Starting file upload to Cloudinary...');
      const uploadResult = await uploadFile(formData.file);
      console.log('Upload result:', uploadResult);

      if (!uploadResult.downloadURL) {
        throw new Error('File upload failed - no URL received');
      }

      const eventData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fileUrl: uploadResult.downloadURL,
        fileName: uploadResult.fileName || 'unknown',
        fileType: formData.file.type || 'unknown',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('Creating event with data:', eventData);
      await addDoc(collection(db, 'events'), eventData);

      setFormData({ name: '', description: '', file: null });
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      alert('Event added successfully');
      setActiveSection('view-events');
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'events', eventId));
      alert('Event deleted');
      fetchEvents();
    } catch (error) {
      alert('Delete error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (event) => {
    setEditingEvent(event.id);
    setFormData({
      name: event.name,
      description: event.description,
      file: null
    });
    setActiveSection('add-event');
  };

  const handleUpdateEvent = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const eventRef = doc(db, 'events', editingEvent);
      const currentEvent = events.find(e => e.id === editingEvent);

      let fileUrl = currentEvent.fileUrl || '';
      let fileName = currentEvent.fileName || 'unknown';
      let fileType = currentEvent.fileType || 'unknown';

      if (formData.file) {
        console.log('Uploading new file...');
        const uploadResult = await uploadFile(formData.file);
        
        if (!uploadResult.downloadURL) {
          throw new Error('File upload failed - no URL received');
        }
        
        fileUrl = uploadResult.downloadURL;
        fileName = uploadResult.fileName || 'unknown';
        fileType = formData.file.type || 'unknown';
      }

      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fileUrl,
        fileName,
        fileType,
        updatedAt: serverTimestamp()
      };

      console.log('Updating event with data:', updateData);
      await updateDoc(eventRef, updateData);

      setFormData({ name: '', description: '', file: null });
      setEditingEvent(null);

      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';

      alert('Event updated');
      setActiveSection('view-events');
      fetchEvents();
    } catch (error) {
      console.error('Update error:', error);
      alert('Update error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditingEvent(null);
    setFormData({ name: '', description: '', file: null });
    setActiveSection('view-events');
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isImageFile = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  const isPdfFile = (fileType) => {
    return fileType === 'application/pdf';
  };

  const exportRegistrationsToCSV = () => {
    if (registrations.length === 0) {
      alert('No registrations to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'MUID', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(reg => [
        reg.userName || '',
        reg.email || '',
        reg.phone || '',
        reg.muid || '',
        formatDate(reg.registeredAt)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewingRegistrations.name}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render admin panel if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              µ
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">µLearn Admin Panel</h1>
              <p className="text-sm text-slate-500">Manage your events and registrations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Events</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{events.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Section</p>
                <p className="text-lg font-semibold text-slate-800 mt-1">
                  {activeSection === 'add-event' ? (editingEvent ? 'Editing Event' : 'Add Event') : 
                   activeSection === 'view-events' ? 'View Events' : 'Dashboard'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Quick Actions</p>
                <p className="text-sm text-slate-500 mt-1">Manage content</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Actions Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          <div 
            className="px-6 py-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors border-b border-slate-100"
            onClick={() => setActiveSection(activeSection === 'events' ? '' : 'events')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Events Management</h2>
                <p className="text-sm text-slate-500">Create and manage your events</p>
              </div>
            </div>
            <ChevronDown 
              className={`h-5 w-5 text-slate-400 transform transition-transform ${activeSection === 'events' ? 'rotate-180' : ''}`}
            />
          </div>

          {activeSection === 'events' && (
            <div className="p-6 bg-slate-50">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setActiveSection('add-event');
                    setEditingEvent(null);
                    setFormData({ name: '', description: '', file: null });
                    const fileInput = document.getElementById('file-input');
                    if (fileInput) fileInput.value = '';
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 hover:shadow-md transition-all font-medium"
                >
                  <Plus className="h-4 w-4" /> Create New Event
                </button>

                <button
                  onClick={() => setActiveSection('view-events')}
                  className="bg-white text-slate-700 border border-slate-300 px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" /> View All Events ({events.length})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Event Form */}
        {activeSection === 'add-event' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 ${editingEvent ? 'bg-amber-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                  {editingEvent ? <Edit2 className="h-5 w-5 text-amber-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </h3>
                  <p className="text-sm text-slate-500">Fill in the event details below</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Event Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 px-4 py-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your event"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Event File {editingEvent && '(Leave empty to keep current file)'}
                  </label>
                  <input
                    type="file"
                    id="file-input"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                  />
                  <p className="text-xs text-slate-500 mt-2">Supported formats: JPG, PNG, GIF, PDF (Max 10MB)</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Processing...' : editingEvent ? 'Update Event' : 'Create Event'}
                  </button>

                  {editingEvent && (
                    <button
                      onClick={cancelEditing}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Events */}
        {activeSection === 'view-events' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">All Events</h3>
                <p className="text-sm text-slate-500 mt-1">Manage your event collection</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium">No events found</p>
                <p className="text-sm text-slate-500 mt-1">Create your first event to get started</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {events.map(event => (
                  <div key={event.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-all bg-gradient-to-r from-white to-slate-50">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg text-slate-800 mb-2">{event.name}</h4>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(event.createdAt)}</span>
                          </div>
                          {event.updatedAt && event.updatedAt !== event.createdAt && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Updated {formatDate(event.updatedAt)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setViewingEvent(event)}
                            className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md text-sm hover:bg-indigo-100 transition-colors flex items-center gap-1.5 font-medium"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <button
                            onClick={() => handleViewRegistrations(event)}
                            className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md text-sm hover:bg-emerald-100 transition-colors flex items-center gap-1.5 font-medium"
                          >
                            <Users className="h-3.5 w-3.5" />
                            Registrations
                          </button>
                          
                          {event.fileUrl && (
                            <a 
                              href={event.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm hover:bg-blue-100 transition-colors flex items-center gap-1.5 font-medium"
                            >
                              <Download className="h-3.5 w-3.5" />
                              File
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button
                          onClick={() => startEditing(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Event Details Modal */}
        {viewingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-bold">{viewingEvent.name}</h3>
                  <p className="text-blue-100 text-sm mt-1">Event Details</p>
                </div>
                <button
                  onClick={() => setViewingEvent(null)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <File className="h-4 w-4" />
                    Description
                  </h4>
                  <p className="text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-lg">{viewingEvent.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Event Information
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600">Created:</span>
                      <span className="font-medium text-slate-800">{formatDate(viewingEvent.createdAt)}</span>
                    </div>
                    {viewingEvent.updatedAt && viewingEvent.updatedAt !== viewingEvent.createdAt && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="font-medium text-slate-800">{formatDate(viewingEvent.updatedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <File className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600">File Type:</span>
                      <span className="font-medium text-slate-800">{viewingEvent.fileType || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {viewingEvent.fileUrl && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                      {isImageFile(viewingEvent.fileType) ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
                      Uploaded File
                    </h4>
                    
                    {isImageFile(viewingEvent.fileType) ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <img 
                          src={viewingEvent.fileUrl} 
                          alt={viewingEvent.name}
                          className="w-full h-auto"
                        />
                      </div>
                    ) : isPdfFile(viewingEvent.fileType) ? (
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <iframe
                          src={viewingEvent.fileUrl}
                          className="w-full h-96"
                          title="PDF Viewer"
                        />
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
                        <File className="h-16 w-16 mx-auto text-slate-400 mb-3" />
                        <p className="text-slate-600 mb-4">File preview not available</p>
                        <a 
                          href={viewingEvent.fileUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setViewingEvent(null);
                      startEditing(viewingEvent);
                    }}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Event
                  </button>
                  <button
                    onClick={() => setViewingEvent(null)}
                    className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Registrations Modal */}
        {viewingRegistrations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-center rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-bold mb-1">Event Registrations</h3>
                  <p className="text-emerald-100">{viewingRegistrations.name}</p>
                </div>
                <button
                  onClick={() => {
                    setViewingRegistrations(null);
                    setRegistrations([]);
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {loadingRegistrations ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading registrations...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-800 font-semibold text-lg">No registrations yet</p>
                    <p className="text-slate-500 text-sm mt-1">Registrations will appear here once users sign up</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 rounded-lg border border-emerald-200">
                        <p className="text-sm text-slate-600">Total Registrations</p>
                        <p className="text-2xl font-bold text-emerald-700">{registrations.length}</p>
                      </div>
                      <button
                        onClick={exportRegistrationsToCSV}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
                      >
                        <Download className="h-4 w-4" />
                        Export to CSV
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">#</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">MUID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Registered At</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {registrations.map((registration, index) => (
                            <tr key={registration.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-4 text-sm text-slate-600 font-medium">{index + 1}</td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <span className="font-medium text-slate-800">{registration.userName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-slate-400" />
                                  <span className="text-sm text-slate-600">{registration.email}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-slate-400" />
                                  <span className="text-sm text-slate-600">{registration.phone}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
                                  {registration.muid}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-slate-600">
                                {formatDate(registration.registeredAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-6 border-t border-slate-200 mt-6">
                  <button
                    onClick={() => {
                      setViewingRegistrations(null);
                      setRegistrations([]);
                    }}
                    className="bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;