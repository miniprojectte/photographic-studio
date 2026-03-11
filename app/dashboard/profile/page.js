'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Calendar,
  Edit3,
  Save,
  X
} from 'lucide-react';

export default function DashboardProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      location: parsedUser.location || '',
      bio: parsedUser.bio || ''
    });
  }, [router]);

  const handleSave = () => {
    // In a real app, this would save to the backend
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Sessions', value: 12 },
    { label: 'Photos Received', value: '1,024' },
    { label: 'Member Since', value: 'Dec 2024' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#C45D3E]/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Profile Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#D4A853] flex items-center justify-center text-white text-4xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#C45D3E] flex items-center justify-center text-white border-4 border-[#0D0D0D]">
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>

          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="text-3xl font-bold text-white text-center bg-transparent border-b-2 border-[#C45D3E] focus:outline-none mb-2"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
          )}

          <p className="text-white/50">
            {user.role === 'admin' ? 'Administrator' : 'Client'} at MN Studio
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-[#161616] border border-white/5"
            >
              <p className="text-2xl font-bold text-gradient-warm">{stat.value}</p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Profile Details */}
        <motion.div
          className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          </div>

          <div className="divide-y divide-white/5">
            {/* Email */}
            <div className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C45D3E]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#C45D3E]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/40 mb-1">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent text-white focus:outline-none border-b border-white/10 focus:border-[#C45D3E] pb-1"
                  />
                ) : (
                  <p className="text-white">{user.email}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-[#D4A853]" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/40 mb-1">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Add phone number"
                    className="w-full bg-transparent text-white focus:outline-none border-b border-white/10 focus:border-[#C45D3E] pb-1 placeholder:text-white/30"
                  />
                ) : (
                  <p className="text-white">{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-white/50" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/40 mb-1">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Add location"
                    className="w-full bg-transparent text-white focus:outline-none border-b border-white/10 focus:border-[#C45D3E] pb-1 placeholder:text-white/30"
                  />
                ) : (
                  <p className="text-white">{user.location || 'Not provided'}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/40 mb-2">Bio</p>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full bg-transparent text-white focus:outline-none border border-white/10 focus:border-[#C45D3E] rounded-lg p-3 placeholder:text-white/30 resize-none"
                    />
                  ) : (
                    <p className="text-white">{user.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Danger Zone */}
        {!isEditing && (
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-red-500/5 border border-red-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h3>
            <p className="text-white/50 text-sm mb-4">
              Permanently delete your account and all associated data.
            </p>
            <button className="px-4 py-2 bg-red-500/10 text-red-400 text-sm font-medium rounded-lg border border-red-500/20 hover:bg-red-500/20 transition-colors">
              Delete Account
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
