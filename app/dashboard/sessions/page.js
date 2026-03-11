'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sessionsAPI, bookingsAPI } from '@/app/utils/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Filter,
  Search,
  ChevronRight,
  Plus,
  Aperture
} from 'lucide-react';

export default function DashboardSessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadSessions();
  }, [router]);

  const loadSessions = async () => {
    try {
      const [sessionsData, bookingsData] = await Promise.all([
        sessionsAPI.getUserSessions(),
        bookingsAPI.getUserBookings()
      ]);

      const allItems = [
        ...(sessionsData.sessions || []).map(s => ({ ...s, source: 'session' })),
        ...(bookingsData.bookings || []).map(b => ({ ...b, source: 'booking' }))
      ];

      setSessions(allItems);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      'scheduled': 'bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30',
      'confirmed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'in-progress': 'bg-[#C45D3E]/20 text-[#C45D3E] border-[#C45D3E]/30',
      'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
      'pending': 'bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30'
    };
    return styles[status?.toLowerCase()] || styles['pending'];
  };

  const filteredSessions = sessions.filter(session => {
    const matchesFilter = filter === 'all' || session.status?.toLowerCase() === filter;
    const matchesSearch = session.sessionType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Link>
            </div>
            <Link
              href="/booking"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white text-sm font-medium rounded-lg hover:shadow-lg hover:shadow-[#C45D3E]/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Book New Session
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">My Sessions</h1>
          <p className="text-white/50">View and manage all your photography sessions</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#161616] border border-white/5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filter === status
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sessions List */}
        {filteredSessions.length > 0 ? (
          <div className="space-y-4">
            {filteredSessions.map((session, index) => {
              const sessionDate = session.date ? new Date(session.date) : null;

              return (
                <motion.div
                  key={session._id}
                  className="p-6 rounded-2xl bg-[#161616] border border-white/5 hover:border-[#C45D3E]/20 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#C45D3E]/10 flex items-center justify-center flex-shrink-0">
                        <Camera className="w-6 h-6 text-[#C45D3E]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {session.title || `${session.sessionType || 'Photography'} Session`}
                          </h3>
                          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusStyle(session.status)}`}>
                            {session.status || 'Pending'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                          {sessionDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                          )}
                          {sessionDate && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          )}
                          {session.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4" />
                              {typeof session.location === 'object' ? session.location.address : session.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Sessions Found</h3>
            <p className="text-white/50 mb-6">
              {filter !== 'all' ? `No ${filter} sessions yet.` : "You haven't booked any sessions yet."}
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
              Book Your First Session
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
