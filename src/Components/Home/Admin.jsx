import React, { useState, useEffect } from 'react';
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
import { ChevronDown, Plus, Edit2, Trash2, File, Image, X, Calendar, Clock, Users, Mail, Phone, User } from 'lucide-react';

const Admin = () => {
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
    fetchEvents();
  }, []);

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

      // Check Cloudinary config
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
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">µLearn Admin Panel</h1>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div 
            className="p-4 border-b border-gray-200 cursor-pointer flex items-center justify-between hover:bg-gray-50"
            onClick={() => setActiveSection(activeSection === 'events' ? '' : 'events')}
          >
            <h2 className="text-xl font-semibold text-gray-700">📅 Events Management</h2>
            <ChevronDown 
              className={`h-5 w-5 text-gray-500 transform transition-transform ${activeSection === 'events' ? 'rotate-180' : ''}`}
            />
          </div>

          {activeSection === 'events' && (
            <div className="p-4 flex gap-4 mb-6">
              <button
                onClick={() => {
                  setActiveSection('add-event');
                  setEditingEvent(null);
                  setFormData({ name: '', description: '', file: null });
                  const fileInput = document.getElementById('file-input');
                  if (fileInput) fileInput.value = '';
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <Plus className="h-4 w-4" /> Add New Event
              </button>

              <button
                onClick={() => setActiveSection('view-events')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                View All Events ({events.length})
              </button>
            </div>
          )}
        </div>

        {activeSection === 'add-event' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event name"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 px-3 py-2 rounded h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Event description"
              />

              <input
                type="file"
                id="file-input"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-4">
                <button
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : editingEvent ? 'Update Event' : 'Add Event'}
                </button>

                {editingEvent && (
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'view-events' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">All Events</h3>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No events found. Add your first event!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {events.map(event => (
                  <div key={event.id} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-800">{event.name}</h4>
                        <p className="text-gray-600 mt-2">{event.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.createdAt)}</span>
                          </div>
                          {event.updatedAt && event.updatedAt !== event.createdAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Updated: {formatDate(event.updatedAt)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => setViewingEvent(event)}
                            className="bg-purple-500 text-white px-4 py-2 rounded text-sm hover:bg-purple-600 flex items-center gap-2"
                          >
                            {isImageFile(event.fileType) ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
                            View Details
                          </button>

                          <button
                            onClick={() => handleViewRegistrations(event)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded text-sm hover:bg-emerald-600 flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            View Registrations
                          </button>
                          
                          {event.fileUrl && (
                            <a 
                              href={event.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                            >
                              Open File
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEditing(event)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit event"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete event"
                        >
                          <Trash2 className="h-5 w-5" />
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
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">{viewingEvent.name}</h3>
                <button
                  onClick={() => setViewingEvent(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{viewingEvent.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-2">Event Information</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">{formatDate(viewingEvent.createdAt)}</span>
                    </div>
                    {viewingEvent.updatedAt && viewingEvent.updatedAt !== viewingEvent.createdAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(viewingEvent.updatedAt)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">File Type:</span>
                      <span className="font-medium">{viewingEvent.fileType || 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {viewingEvent.fileUrl && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Uploaded File</h4>
                    
                    {isImageFile(viewingEvent.fileType) ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={viewingEvent.fileUrl} 
                          alt={viewingEvent.name}
                          className="w-full h-auto"
                        />
                      </div>
                    ) : isPdfFile(viewingEvent.fileType) ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <iframe
                          src={viewingEvent.fileUrl}
                          className="w-full h-96"
                          title="PDF Viewer"
                        />
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded-lg p-6 text-center">
                        <File className="h-16 w-16 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-4">File preview not available</p>
                        <a 
                          href={viewingEvent.fileUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-500 text-white px-6 py-2 rounded inline-block hover:bg-blue-600"
                        >
                          Download File
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setViewingEvent(null);
                      startEditing(viewingEvent);
                    }}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Event
                  </button>
                  <button
                    onClick={() => setViewingEvent(null)}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
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
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 flex justify-between items-center">
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
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading registrations...</p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">No registrations yet for this event</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-semibold text-gray-800">
                        Total Registrations: <span className="text-emerald-600">{registrations.length}</span>
                      </h4>
                      <button
                        onClick={exportRegistrationsToCSV}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                      >
                        <File className="h-4 w-4" />
                        Export to CSV
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b-2 border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">MUID</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Registered At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((registration, index) => (
                            <tr key={registration.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-gray-800">{registration.userName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{registration.email}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">{registration.phone}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium">
                                  {registration.muid}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-600">
                                {formatDate(registration.registeredAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => {
                      setViewingRegistrations(null);
                      setRegistrations([]);
                    }}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-semibold"
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