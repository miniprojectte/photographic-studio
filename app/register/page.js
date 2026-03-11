'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Aperture, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '../utils/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await authAPI.register(formData);
      alert('Registration successful! Please login to continue.');
      router.push('/login');

    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const benefits = [
    'Book photo sessions online',
    'Access your photo gallery',
    'Get exclusive offers',
    'Priority booking access'
  ];

  return (
    <div className="min-h-screen flex bg-[#0D0D0D] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[5%] w-[500px] h-[500px] bg-[#C45D3E]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-[#D4A853]/5 rounded-full blur-[100px]" />
      </div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          className="w-full max-w-[420px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back to home link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center">
              <Aperture className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">MN Studio</span>
          </div>

          {/* Form card */}
          <div className="bg-[#161616]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-white/50">Join MN Studio and start your creative journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-12 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] focus:ring-1 focus:ring-[#C45D3E]/30 transition-all"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-white/30 text-xs mt-2">Must be at least 8 characters long</p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded bg-white/5 border-white/10 text-[#C45D3E] focus:ring-[#C45D3E]/30"
                />
                <label htmlFor="terms" className="text-sm text-white/50">
                  I agree to the{' '}
                  <Link href="#" className="text-[#C45D3E] hover:text-[#D97B5D]">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-[#C45D3E] hover:text-[#D97B5D]">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl shadow-lg shadow-[#C45D3E]/20 hover:shadow-[#C45D3E]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-sm">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Login link */}
            <p className="text-center text-white/50">
              Already have an account?{' '}
              <Link href="/login" className="text-[#C45D3E] hover:text-[#D97B5D] font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Branding panel (hidden on mobile) */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-[#1A1512]/80 to-[#0D0D0D]" />
        <div className="absolute inset-0 border-l border-white/5" />

        {/* Decorative grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        <div className="relative z-10 max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center shadow-lg shadow-[#C45D3E]/20">
              <Aperture className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">MN Studio</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4A853]">Photography</p>
            </div>
          </div>

          {/* Welcome text */}
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Start capturing<br />
            <span className="text-gradient-warm">beautiful moments</span>
          </h1>
          <p className="text-white/50 text-lg mb-12 leading-relaxed">
            Create your account and unlock access to professional photography services, exclusive galleries, and personalized booking experience.
          </p>

          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="w-6 h-6 rounded-full bg-[#C45D3E]/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[#C45D3E]" />
                </div>
                <span className="text-white/70">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            className="mt-12 p-6 bg-white/[0.03] border border-white/5 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white/60 italic mb-4">
              "MN Studio captured our wedding beautifully. The online gallery made sharing with family so easy!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center text-white font-medium text-sm">
                SM
              </div>
              <div>
                <p className="text-white font-medium text-sm">Sarah Mitchell</p>
                <p className="text-white/40 text-xs">Happy Client</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
