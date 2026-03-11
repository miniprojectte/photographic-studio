'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Camera, ChevronLeft, ChevronRight, Check, User, Mail, Phone } from 'lucide-react';
import { bookingsAPI } from '../utils/api';

const sessionTypes = [
  { id: 'portrait', name: 'Portrait', price: 199, duration: '1 hour', icon: '📸' },
  { id: 'wedding', name: 'Wedding', price: 2499, duration: 'Full day', icon: '💒' },
  { id: 'family', name: 'Family', price: 299, duration: '1.5 hours', icon: '👨‍👩‍👧‍👦' },
  { id: 'event', name: 'Event', price: 399, duration: '3 hours', icon: '🎉' },
  { id: 'commercial', name: 'Commercial', price: 599, duration: '2 hours', icon: '💼' }
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export default function Booking() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({
    sessionType: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Pre-fill user data
        setBookingData(prev => ({
          ...prev,
          name: parsedUser.name || '',
          email: parsedUser.email || ''
        }));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty days for alignment
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateAvailable = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const combineDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    // Parse time like "9:00 AM" or "1:00 PM"
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    // Validate required fields
    if (!bookingData.name || !bookingData.email || !bookingData.phone) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    // Clean phone number (remove all non-digit characters except +)
    const cleanPhone = bookingData.phone.replace(/[^\d+]/g, '');
    
    // Indian phone validation
    const indianPhoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!indianPhoneRegex.test(cleanPhone)) {
      alert('Please enter a valid Indian phone number (10 digits starting with 6-9, optional +91 prefix)');
      return;
    }

    setIsSubmitting(true);
    try {
      // Combine date and time into a single datetime
      const bookingDateTime = combineDateTime(bookingData.date, bookingData.time);

      await bookingsAPI.createBooking({
        name: bookingData.name,
        email: bookingData.email,
        phone: cleanPhone,
        sessionType: bookingData.sessionType,
        date: bookingDateTime.toISOString(),
        message: bookingData.message || ''
      });
      setStep(4);
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = sessionTypes.find(t => t.id === bookingData.sessionType);

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Session Type</h2>
        <p className="text-white/50">Choose the type of photography session you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessionTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => setBookingData(prev => ({ ...prev, sessionType: type.id }))}
            className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${bookingData.sessionType === type.id
                ? 'bg-[#C45D3E]/10 border-[#C45D3E] shadow-lg shadow-[#C45D3E]/10'
                : 'bg-[#161616] border-white/5 hover:border-white/20'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {bookingData.sessionType === type.id && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#C45D3E] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="text-3xl mb-4 block">{type.icon}</span>
            <h3 className="text-xl font-semibold text-white mb-1">{type.name}</h3>
            <p className="text-white/40 text-sm mb-3">{type.duration}</p>
            <p className="text-[#D4A853] font-bold text-lg">${type.price}</p>
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!bookingData.sessionType}
        className="w-full py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        Continue
        <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Date & Time</h2>
        <p className="text-white/50">Choose your preferred session date and time</p>
      </div>

      {/* Calendar */}
      <div className="bg-[#161616] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white/50" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-white/40 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentMonth).map((date, index) => {
            if (!date) return <div key={index} />;

            const isAvailable = isDateAvailable(date);
            const isSelected = bookingData.date === date.toISOString().split('T')[0];

            return (
              <button
                key={index}
                onClick={() => isAvailable && setBookingData(prev => ({
                  ...prev,
                  date: date.toISOString().split('T')[0]
                }))}
                disabled={!isAvailable}
                className={`h-12 rounded-lg font-medium transition-all ${isSelected
                    ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] text-white'
                    : isAvailable
                      ? 'text-white hover:bg-white/10'
                      : 'text-white/20 cursor-not-allowed'
                  }`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {bookingData.date && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Available Times</h3>
          <div className="grid grid-cols-4 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setBookingData(prev => ({ ...prev, time }))}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${bookingData.time === time
                    ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!bookingData.date || !bookingData.time}
          className="flex-1 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Details</h2>
        <p className="text-white/50">Please provide your contact information</p>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              value={bookingData.name}
              onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="email"
              value={bookingData.email}
              onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="tel"
              value={bookingData.phone}
              onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="9876543210 or +91 9876543210"
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-white/40">Indian mobile number (10 digits starting with 6-9)</p>
        </div>

        {/* Message / Notes */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={bookingData.message}
            onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Any specific requirements, ideas, or questions..."
            rows={4}
            className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all resize-none"
          />
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-[#161616] rounded-2xl border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C45D3E]/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#C45D3E]" />
            </div>
            <div>
              <p className="text-white font-medium">{selectedType?.name} Photography</p>
              <p className="text-white/40 text-sm">{selectedType?.duration}</p>
            </div>
            <p className="ml-auto text-[#D4A853] font-bold">${selectedType?.price}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#D4A853]" />
            </div>
            <div>
              <p className="text-white font-medium">
                {new Date(bookingData.date).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric'
                })}
              </p>
              <p className="text-white/40 text-sm">{bookingData.time}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-white/50">Total</span>
          <span className="text-2xl font-bold text-gradient-warm">${selectedType?.price}</span>
        </div>
      </div>

      {!isLoggedIn && (
        <div className="p-4 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-xl">
          <p className="text-[#D4A853] text-sm">
            You'll need to log in to complete your booking.
            <button
              onClick={() => router.push('/login')}
              className="underline ml-1 hover:text-[#E5C77A]"
            >
              Sign in now
            </button>
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !bookingData.name || !bookingData.email || !bookingData.phone}
          className="flex-1 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            <>Confirm Booking</>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center">
        <Check className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
      <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
        Your session has been scheduled. We've sent a confirmation email with all the details.
      </p>

      <div className="bg-[#161616] rounded-2xl border border-white/5 p-6 max-w-sm mx-auto mb-8">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-[#C45D3E]" />
            <span className="text-white">{selectedType?.name} Photography</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#D4A853]" />
            <span className="text-white">
              {new Date(bookingData.date).toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric'
              })} at {bookingData.time}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="px-8 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 transition-all"
      >
        Go to Dashboard
      </button>
    </motion.div>
  );

  return (
    <main className="min-h-screen text-white relative bg-[#0D0D0D]">

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-[#C45D3E]/10 border border-[#C45D3E]/20 rounded-full text-[#C45D3E] text-sm font-medium mb-6">
              Book a Session
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Schedule Your </span>
              <span className="text-gradient-warm">Session</span>
            </h1>
            <p className="text-white/50 text-lg">
              Book your photography session in just a few simple steps
            </p>
          </motion.div>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-4 mb-12">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${s === step
                      ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] text-white'
                      : s < step
                        ? 'bg-[#C45D3E] text-white'
                        : 'bg-white/5 text-white/40'
                    }`}>
                    {s < step ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-16 h-0.5 ${s < step ? 'bg-[#C45D3E]' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Form Content */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </section>
    </main>
  );
}
