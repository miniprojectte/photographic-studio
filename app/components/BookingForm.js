'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Mail, Phone, MessageSquare, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sessionTypes = [
  { value: 'portrait', label: 'Portrait Session' },
  { value: 'wedding', label: 'Wedding Photography' },
  { value: 'family', label: 'Family Photos' },
  { value: 'event', label: 'Event Photography' },
  { value: 'commercial', label: 'Commercial Shoot' }
];

export default function BookingForm({ onBookingCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionType: '',
    date: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.sessionType) {
      newErrors.sessionType = 'Session type is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate <= today) {
        newErrors.date = 'Please select a future date';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          sessionType: '',
          date: '',
          message: ''
        });
        setErrors({});
        
        if (onBookingCreated) {
          onBookingCreated(data.data);
        }
        
        // Use notification system if available, fallback to alert
        if (window.notify) {
          window.notify.success('Booking created successfully!', {
            title: 'Success',
            duration: 5000
          });
        } else {
          alert('Booking created successfully!');
        }
      } else {
        // Handle validation errors from server
        if (Array.isArray(data.error)) {
          const serverErrors = {};
          data.error.forEach(error => {
            // Parse error messages to map to form fields
            if (error.includes('Name')) serverErrors.name = error;
            else if (error.includes('Email')) serverErrors.email = error;
            else if (error.includes('Phone')) serverErrors.phone = error;
            else if (error.includes('Session type')) serverErrors.sessionType = error;
            else if (error.includes('date')) serverErrors.date = error;
            else if (error.includes('Message')) serverErrors.message = error;
          });
          setErrors(serverErrors);
        } else {
          const errorMessage = data.error || 'Failed to create booking';
          if (window.notify) {
            window.notify.error(errorMessage, {
              title: 'Booking Failed',
              duration: 7000
            });
          } else {
            alert(errorMessage);
          }
        }
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      const errorMessage = 'An error occurred while creating the booking';
      if (window.notify) {
        window.notify.error(errorMessage, {
          title: 'Error',
          duration: 7000
        });
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a Photo Session</h2>
        <p className="text-gray-600">Fill out the form below to schedule your photography session</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User className="mr-2 h-4 w-4" />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Mail className="mr-2 h-4 w-4" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Phone className="mr-2 h-4 w-4" />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        {/* Session Type Field */}
        <div>
          <label htmlFor="sessionType" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Camera className="mr-2 h-4 w-4" />
            Session Type *
          </label>
          <select
            id="sessionType"
            name="sessionType"
            value={formData.sessionType}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.sessionType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a session type</option>
            {sessionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.sessionType && <p className="mt-1 text-sm text-red-600">{errors.sessionType}</p>}
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="mr-2 h-4 w-4" />
            Preferred Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={getTomorrowDate()}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <MessageSquare className="mr-2 h-4 w-4" />
            Additional Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Tell us about your vision, special requirements, or any questions you have"
          />
          <p className="mt-1 text-sm text-gray-500">{formData.message.length}/500 characters</p>
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creating Booking...' : 'Book Session'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}