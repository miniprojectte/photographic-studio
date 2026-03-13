'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Camera, ChevronLeft, ChevronRight,
  Check, User, Mail, Phone, CreditCard, ShieldCheck,
  Loader2, AlertCircle, IndianRupee, Sparkles
} from 'lucide-react';
import { bookingsAPI } from '../utils/api';

const API_BASE = 'http://localhost:5000/api';

const sessionTypes = [
  { id: 'portrait', name: 'Portrait', price: 199, duration: '1 hour', icon: '📸', desc: 'Individual or couple portraits' },
  { id: 'wedding', name: 'Wedding', price: 2499, duration: 'Full day', icon: '💒', desc: 'Complete wedding day coverage' },
  { id: 'family', name: 'Family', price: 299, duration: '1.5 hours', icon: '👨‍👩‍👧‍👦', desc: 'Family portrait sessions' },
  { id: 'event', name: 'Event', price: 399, duration: '3 hours', icon: '🎉', desc: 'Corporate & social events' },
  { id: 'commercial', name: 'Commercial', price: 599, duration: '2 hours', icon: '💼', desc: 'Product & brand photography' },
];

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - i);

// Load Razorpay script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Booking() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [completedBooking, setCompletedBooking] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [bookingData, setBookingData] = useState({
    sessionType: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setBookingData(prev => ({ ...prev, name: parsed.name || '', email: parsed.email || '' }));
      } catch (e) { /* ignore */ }
    }
    // Pre-load Razorpay script
    loadRazorpayScript();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
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
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    else if (period === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const selectedType = sessionTypes.find(t => t.id === bookingData.sessionType);

  // ── Validation ───────────────────────────────────────────────────
  const validateStep3 = () => {
    if (!bookingData.name.trim()) return 'Name is required';
    if (!bookingData.email.trim()) return 'Email is required';
    const cleanPhone = bookingData.phone.replace(/[^\d+]/g, '');
    if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) return 'Enter a valid Indian mobile number (10 digits, starting with 6–9)';
    return null;
  };

  // ── Razorpay Payment ─────────────────────────────────────────────
  const handlePayment = async () => {
    if (!isLoggedIn) { router.push('/login'); return; }
    const err = validateStep3();
    if (err) { setPaymentError(err); return; }
    setPaymentError('');

    setIsSubmitting(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load. Check your internet connection.');

      const token = localStorage.getItem('token');
      const cleanPhone = bookingData.phone.replace(/[^\d+]/g, '');

      // 1️⃣ Create Razorpay order on backend
      const orderRes = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ amount: selectedType.price, sessionType: bookingData.sessionType }),
      });

      // Handle 401 — session expired or not logged in
      if (orderRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      let orderData;
      try {
        orderData = await orderRes.json();
      } catch {
        throw new Error(`Server error (${orderRes.status}). Please try again.`);
      }

      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || `Payment order failed (${orderRes.status})`);
      }

      const bookingDateTime = combineDateTime(bookingData.date, bookingData.time);

      // 2️⃣ Open Razorpay checkout modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MN Studio',
        description: `${selectedType.name} Photography Session`,
        image: '/favicon.ico',
        order_id: orderData.orderId,
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: cleanPhone,
        },
        notes: { sessionType: bookingData.sessionType },
        theme: { color: '#C45D3E' },
        modal: { backdropclose: false },
        handler: async (response) => {
          // 3️⃣ Verify payment on backend & create booking
          try {
            const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingData: {
                  name: bookingData.name,
                  email: bookingData.email,
                  phone: cleanPhone,
                  sessionType: bookingData.sessionType,
                  date: bookingDateTime.toISOString(),
                  message: bookingData.message || '',
                  amount: selectedType.price,
                },
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData.message || 'Payment verification failed');

            setCompletedBooking({ paymentId: response.razorpay_payment_id });
            setStep(4);
          } catch (e) {
            setPaymentError(e.message);
            setIsSubmitting(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setPaymentError(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });
      rzp.open();

      // Note: isSubmitting stays true while checkout modal is open
    } catch (e) {
      setPaymentError(e.message);
      setIsSubmitting(false);
    }
  };

  // ── Step 1 – Session Type ────────────────────────────────────────
  const renderStep1 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
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
              : 'bg-[#161616] border-white/5 hover:border-white/20'}`}
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
            <p className="text-white/40 text-xs mb-3">{type.desc} · {type.duration}</p>
            <p className="text-[#D4A853] font-bold text-lg">₹{type.price.toLocaleString('en-IN')}</p>
          </motion.button>
        ))}
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!bookingData.sessionType}
        className="w-full py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        Continue <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  // ── Step 2 – Date & Time ─────────────────────────────────────────
  const renderStep2 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Date & Time</h2>
        <p className="text-white/50">Choose your preferred session date and time</p>
      </div>

      <div className="bg-[#161616] rounded-2xl border border-white/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-white/50" />
          </button>
          <h3 className="text-lg font-semibold text-white">
            {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-white/40 text-sm py-2">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentMonth).map((date, idx) => {
            if (!date) return <div key={idx} />;
            const avail = isDateAvailable(date);
            const sel = bookingData.date === date.toISOString().split('T')[0];
            return (
              <button
                key={idx}
                onClick={() => avail && setBookingData(prev => ({ ...prev, date: date.toISOString().split('T')[0] }))}
                disabled={!avail}
                className={`h-12 rounded-lg font-medium transition-all ${sel ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] text-white' : avail ? 'text-white hover:bg-white/10' : 'text-white/20 cursor-not-allowed'}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {bookingData.date && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3 className="text-lg font-semibold text-white mb-4">Available Times</h3>
            <div className="grid grid-cols-4 gap-3">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setBookingData(prev => ({ ...prev, time }))}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${bookingData.time === time ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!bookingData.date || !bookingData.time}
          className="flex-1 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          Continue <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );

  // ── Step 3 – Details + Payment ───────────────────────────────────
  const renderStep3 = () => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Details & Payment</h2>
        <p className="text-white/50">Provide your contact info and pay securely via Razorpay</p>
      </div>

      <div className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Full Name *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input type="text" value={bookingData.name}
              onChange={e => setBookingData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Rahul Sharma"
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input type="email" value={bookingData.email}
              onChange={e => setBookingData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="rahul@email.com"
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Phone Number *</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input type="tel" value={bookingData.phone}
              onChange={e => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 9876543210"
              className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
            />
          </div>
          <p className="mt-1 text-xs text-white/40">10-digit Indian mobile number (6–9 prefix)</p>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Additional Notes <span className="text-white/30">(Optional)</span></label>
          <textarea value={bookingData.message}
            onChange={e => setBookingData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Any specific requirements or ideas..."
            rows={3}
            className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all resize-none"
          />
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-[#161616] rounded-2xl border border-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C45D3E]/10 flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-[#C45D3E]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{selectedType?.name} Photography</p>
              <p className="text-white/40 text-sm">{selectedType?.duration}</p>
            </div>
            <p className="text-[#D4A853] font-bold">₹{selectedType?.price?.toLocaleString('en-IN')}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#D4A853]" />
            </div>
            <div>
              <p className="text-white font-medium">
                {new Date(bookingData.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-white/40 text-sm">{bookingData.time}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-white/5 flex items-center justify-between">
          <span className="text-white/60">Total Amount</span>
          <span className="text-2xl font-bold text-gradient-warm">₹{selectedType?.price?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Payment security badge */}
      <div className="flex items-center gap-3 p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
        <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
        <div>
          <p className="text-green-400 text-sm font-medium">Secured by Razorpay</p>
          <p className="text-white/40 text-xs">Your payment is 100% secure. UPI · Cards · Net Banking · Wallets accepted.</p>
        </div>
      </div>

      {/* Login warning */}
      {!isLoggedIn && (
        <div className="p-4 bg-[#D4A853]/10 border border-[#D4A853]/20 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#D4A853] flex-shrink-0 mt-0.5" />
          <p className="text-[#D4A853] text-sm">
            You need to log in before paying.{' '}
            <button onClick={() => router.push('/login')} className="underline font-semibold hover:text-[#E5C77A]">Sign in now →</button>
          </p>
        </div>
      )}

      {/* Payment error */}
      <AnimatePresence>
        {paymentError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{paymentError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-4">
        <button onClick={() => setStep(2)} className="flex-1 py-4 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <motion.button
          onClick={handlePayment}
          disabled={isSubmitting}
          className="flex-1 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Opening Checkout...</>
          ) : (
            <><CreditCard className="w-5 h-5" /> Pay ₹{selectedType?.price?.toLocaleString('en-IN')}</>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  // ── Step 4 – Success ─────────────────────────────────────────────
  const renderStep4 = () => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
      <motion.div
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-3xl font-bold text-white mb-2">Booking Confirmed! 🎉</h2>
        <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
          Payment successful. Your session is booked and we'll send you a confirmation email shortly.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[#161616] rounded-2xl border border-white/5 p-6 max-w-sm mx-auto mb-4">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-[#C45D3E]" />
            <span className="text-white">{selectedType?.name} Photography</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#D4A853]" />
            <span className="text-white">
              {new Date(bookingData.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })} at {bookingData.time}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <IndianRupee className="w-5 h-5 text-green-500" />
            <span className="text-green-400 font-semibold">₹{selectedType?.price?.toLocaleString('en-IN')} Paid</span>
          </div>
          {completedBooking?.paymentId && (
            <div className="pt-3 border-t border-white/5">
              <p className="text-white/30 text-xs">Payment ID</p>
              <p className="text-white/60 text-xs font-mono">{completedBooking.paymentId}</p>
            </div>
          )}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        onClick={() => router.push('/dashboard')}
        className="px-8 py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 transition-all"
        whileHover={{ scale: 1.02 }}
      >
        View My Bookings →
      </motion.button>
    </motion.div>
  );

  // ── Main render ──────────────────────────────────────────────────
  return (
    <main className="min-h-screen text-white relative bg-[#0D0D0D]">

      {/* Header */}
      <section className="relative pt-32 pb-12 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-[#C45D3E]/10 border border-[#C45D3E]/20 rounded-full text-[#C45D3E] text-sm font-medium mb-6">
              Book a Session
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Schedule Your </span>
              <span className="text-gradient-warm">Session</span>
            </h1>
            <p className="text-white/50 text-lg">Book and pay securely in just a few steps</p>
          </motion.div>

          {/* Progress Steps */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-4 mb-12">
              {[
                { n: 1, label: 'Session' },
                { n: 2, label: 'Schedule' },
                { n: 3, label: 'Payment' },
              ].map(({ n, label }, i, arr) => (
                <React.Fragment key={n}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${n === step ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] text-white shadow-lg shadow-[#C45D3E]/30' : n < step ? 'bg-[#C45D3E] text-white' : 'bg-white/5 text-white/40'}`}>
                      {n < step ? <Check className="w-5 h-5" /> : n}
                    </div>
                    <span className={`text-xs ${n === step ? 'text-[#C45D3E]' : 'text-white/30'}`}>{label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className={`w-16 h-0.5 mb-4 ${n < step ? 'bg-[#C45D3E]' : 'bg-white/10'}`} />
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
          <AnimatePresence mode="wait">
            {step === 1 && <React.Fragment key="s1">{renderStep1()}</React.Fragment>}
            {step === 2 && <React.Fragment key="s2">{renderStep2()}</React.Fragment>}
            {step === 3 && <React.Fragment key="s3">{renderStep3()}</React.Fragment>}
            {step === 4 && <React.Fragment key="s4">{renderStep4()}</React.Fragment>}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
