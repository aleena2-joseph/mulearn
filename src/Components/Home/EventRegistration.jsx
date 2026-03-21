import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserPlus, Mail, User, Phone, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const EventRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId, eventName } = location.state || {};

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    phone: '',
    muid: '' // Member UID field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Redirect if no event data
  if (!eventId || !eventName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Access</h2>
          <p className="text-gray-600 mb-6">No event information found. Please select an event first.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition-colors font-semibold"
          >
            Go Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    const phoneNumber = value.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({
      ...prev,
      phone: phoneNumber
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate phone number length
    if (formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    try {
      // Create registration document in Firebase
      const registrationData = {
        userName: formData.userName,
        email: formData.email,
        phone: `+91${formData.phone}`, // Add +91 prefix
        muid: formData.muid,
        eventId,
        eventName,
        registeredAt: Timestamp.now()
      };

      await addDoc(collection(db, 'eventRegistrations'), registrationData);

      setSuccess(true);
      
      // Reset form
      setFormData({
        userName: '',
        email: '',
        phone: '',
        muid: ''
      });

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('Error submitting registration:', err);
      setError('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            You have successfully registered for <span className="font-semibold text-violet-600">{eventName}</span>
          </p>
          <p className="text-sm text-gray-500">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Events
        </button>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-8">
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Event Registration</h1>
            </div>
            <p className="text-violet-100 text-lg">
              Registering for: <span className="font-semibold">{eventName}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* User Name */}
              <div>
                <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                    
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  
                  />
                </div>
              </div>
<div>
  <label
    htmlFor="phone"
    className="block text-sm font-semibold text-gray-700 mb-2"
  >
    Phone Number <span className="text-red-500">*</span>
  </label>

  <div className="flex items-center border-2 border-gray-200 rounded-xl focus-within:border-violet-500 transition-colors overflow-hidden">
    
    {/* Icon */}
    <div className="pl-3 pr-2 text-gray-400 flex items-center">
      <Phone className="h-5 w-5" />
    </div>

    {/* Country Code */}
    <span className="px-3 py-3 bg-gray-100 text-gray-600 font-semibold border-r border-gray-200">
      +91
    </span>

    {/* Input */}
    <input
      type="tel"
      id="phone"
      name="phone"
      value={formData.phone}
      onChange={handlePhoneChange}
      required
      maxLength="10"
      className="w-full px-4 py-3 focus:outline-none"
    />
  </div>

  <p className="text-xs text-gray-500 mt-1">
    Enter 10-digit mobile number
  </p>
</div>

              {/* MUID */}
              <div>
                <label htmlFor="muid" className="block text-sm font-semibold text-gray-700 mb-2">
                  Member UID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="muid"
                  name="muid"
                  value={formData.muid}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-colors"
                  
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Complete Registration
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
      
      </div>
    </div>
  );
};

export default EventRegistration;