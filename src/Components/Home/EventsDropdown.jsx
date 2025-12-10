import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Add this import
import { db } from '../../firebase';
import { ChevronDown, Calendar, Eye, ExternalLink, X, UserPlus } from 'lucide-react';

const EventsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // Add navigation hook

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const isImageFile = (fileType) => {
    return fileType && fileType.startsWith('image/');
  };

  const isPdfFile = (fileType) => {
    return fileType === 'application/pdf';
  };

  // New function to handle registration navigation
  const handleRegisterClick = () => {
    navigate('/event-registration', {
      state: {
        eventId: selectedEvent.id,
        eventName: selectedEvent.name
      }
    });
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-enter {
          animation: slideDown 0.3s ease-out forwards;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .event-item:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(168, 85, 247, 0.05));
          transform: translateX(4px);
        }
      `}</style>

      <div className="relative py-10" ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group glass-effect text-violet-700 px-6 py-3 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 border-2 border-violet-200"
        >
          <Calendar className="h-5 w-5" />
          <span>View All Events</span>
          <ChevronDown 
            className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
          {events.length > 0 && (
            <span className="bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              {events.length}
            </span>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="dropdown-enter absolute top-full right-0 mt-3 w-96 glass-effect rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Events
              </h3>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
                <p className="text-gray-600 mt-3 text-sm">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-sm">No events available</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="event-item p-4 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 truncate mb-1">
                          {event.name}
                        </h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(event.createdAt)}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="flex-shrink-0 bg-violet-600 text-white p-2 rounded-lg hover:bg-violet-700 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{selectedEvent.name}</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  Description
                </h4>
                <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="mb-6 bg-violet-50 p-4 rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-3">Event Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{formatDate(selectedEvent.createdAt)}</span>
                  </div>
                </div>
              </div>

              {selectedEvent.fileUrl && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Attached File</h4>
                  
                  {isImageFile(selectedEvent.fileType) ? (
                    <div className="border-2 border-violet-200 rounded-xl overflow-hidden">
                      <img 
                        src={selectedEvent.fileUrl} 
                        alt={selectedEvent.name}
                        className="w-full h-auto"
                      />
                    </div>
                  ) : isPdfFile(selectedEvent.fileType) ? (
                    <div className="border-2 border-violet-200 rounded-xl overflow-hidden">
                      <iframe
                        src={selectedEvent.fileUrl}
                        className="w-full h-96"
                        title="PDF Viewer"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-violet-200 rounded-xl p-6 text-center">
                      <ExternalLink className="h-12 w-12 mx-auto text-violet-400 mb-3" />
                      <p className="text-gray-600 mb-4">File preview not available</p>
                    </div>
                  )}

                  <a 
                    href={selectedEvent.fileUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 bg-violet-600 text-white px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:bg-violet-700 transition-colors font-semibold"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open File in New Tab
                  </a>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold flex items-center gap-2 shadow-lg"
                >
                  <UserPlus className="h-5 w-5" />
                  Register for Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsDropdown;