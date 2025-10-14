'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, MapPin, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SessionForm({ session = null, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    client: '',
    sessionType: 'Portrait',
    date: '',
    time: '',
    status: 'Scheduled',
    price: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    notes: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
    if (session) {
      // Populate form with session data for editing
      const sessionDate = new Date(session.date);
      setFormData({
        client: session.client?._id || '',
        sessionType: session.sessionType || 'Portrait',
        date: sessionDate.toISOString().split('T')[0],
        time: sessionDate.toTimeString().slice(0, 5),
        status: session.status || 'Scheduled',
        price: session.price || '',
        location: {
          address: session.location?.address || '',
          city: session.location?.city || '',
          state: session.location?.state || '',
          zipCode: session.location?.zipCode || ''
        },
        notes: session.notes || ''
      });
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // For now, we'll allow manual entry if we can't fetch users
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.client) {
      newErrors.client = 'Client is required';
    }

    if (!formData.sessionType) {
      newErrors.sessionType = 'Session type is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(`${formData.date}T${formData.time || '00:00'}`);
      if (selectedDate < new Date()) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sessionDateTime = new Date(`${formData.date}T${formData.time}`);
      
      const sessionData = {
        client: formData.client,
        sessionType: formData.sessionType,
        date: sessionDateTime.toISOString(),
        status: formData.status,
        price: parseFloat(formData.price),
        location: formData.location,
        notes: formData.notes
      };

      await onSubmit(sessionData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (window.notify) {
        window.notify.error('Failed to save session', {
          title: 'Error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {session ? 'Edit Session' : 'Create New Session'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Client
            </label>
            <select
              value={formData.client}
              onChange={(e) => handleInputChange('client', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.client ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select a client</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.client && (
              <p className="text-sm text-red-600">{errors.client}</p>
            )}
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Session Type</label>
            <select
              value={formData.sessionType}
              onChange={(e) => handleInputChange('sessionType', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.sessionType ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="Wedding">Wedding Photography</option>
              <option value="Portrait">Portrait Session</option>
              <option value="Family">Family Photos</option>
              <option value="Event">Event Photography</option>
              <option value="Commercial">Commercial Shoot</option>
            </select>
            {errors.sessionType && (
              <p className="text-sm text-red-600">{errors.sessionType}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.time && (
                <p className="text-sm text-red-600">{errors.time}</p>
              )}
            </div>
          </div>

          {/* Status and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                required
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </label>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address"
                value={formData.location.address}
                onChange={(e) => handleLocationChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                <input
                  type="text"
                  placeholder="State"
                  value={formData.location.state}
                  onChange={(e) => handleLocationChange('state', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.location.zipCode}
                  onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Additional notes about the session..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {session ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                session ? 'Update Session' : 'Create Session'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}