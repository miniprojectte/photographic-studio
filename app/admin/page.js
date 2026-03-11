'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { bookingsAPI, sessionsAPI, authAPI, messagesAPI } from '@/app/utils/api';
import {
  Calendar,
  Users,
  Camera,
  MessageCircle,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Image,
  RefreshCw,
  Bell,
  LogOut,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    totalSessions: 0,
    scheduledSessions: 0,
    completedSessions: 0,
    totalUsers: 0,
    totalRevenue: 0,
    unreadMessages: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [bookingsRes, bookingStatsRes, sessionStatsRes, usersRes, messagesRes] = await Promise.all([
        bookingsAPI.getAllBookings('?limit=5'),
        bookingsAPI.getStats().catch(() => ({ data: {} })),
        sessionsAPI.getAdminStats().catch(() => ({ data: {} })),
        authAPI.getUsers().catch(() => ({ users: [] })),
        messagesAPI.getAll().catch(() => ({ data: [] }))
      ]);

      // Process bookings
      const bookings = bookingsRes.data || [];
      setRecentBookings(bookings.slice(0, 5));

      // Calculate booking stats
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

      // Session stats from API
      const sessionStats = sessionStatsRes.data || {};

      // Count unread messages (messages where admin is recipient and not read)
      const messages = messagesRes.data || [];
      const unreadMessages = messages.filter(m => !m.readAt && m.recipient?.role === 'admin').length;

      setStats({
        totalBookings: bookings.length,
        pendingBookings,
        confirmedBookings,
        totalSessions: sessionStats.totalSessions || 0,
        scheduledSessions: sessionStats.scheduledSessions || 0,
        completedSessions: sessionStats.completedSessions || 0,
        totalUsers: usersRes.users?.length || 0,
        totalRevenue: sessionStats.totalRevenue || 0,
        unreadMessages
      });

      // Get upcoming sessions
      const sessionsRes = await sessionsAPI.getAllSessions('?status=Scheduled&limit=5').catch(() => ({ data: [] }));
      setUpcomingSessions(sessionsRes.data || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      case 'scheduled': return 'bg-[#C45D3E]/20 text-[#C45D3E]';
      default: return 'bg-white/10 text-white/60';
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Loading dashboard...</p>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-[#0D0D0D] text-white relative overflow-hidden">
        {/* Background Glow Effects */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* Top right orange glow */}
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(196,93,62,0.4) 0%, rgba(196,93,62,0) 70%)',
            }}
          />
          {/* Bottom left gold glow */}
          <div
            className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(212,168,83,0.35) 0%, rgba(212,168,83,0) 70%)',
            }}
          />
          {/* Center ambient glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(196,93,62,0.15) 0%, transparent 60%)',
            }}
          />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white">MN Studio Admin</h1>
                  <p className="text-xs text-white/40">Management Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={loadDashboardData}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4 text-white/50" />
                </button>
                {stats.unreadMessages > 0 && (
                  <Link href="/admin/messages" className="relative p-2 bg-white/5 hover:bg-white/10 rounded-lg">
                    <Bell className="w-4 h-4 text-white/50" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C45D3E] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {stats.unreadMessages}
                    </span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userType');
                    router.push('/login');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-white/50">Here's what's happening with your studio today.</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[
              { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: '#C45D3E' },
              { label: 'Pending', value: stats.pendingBookings, icon: Clock, color: '#EAB308' },
              { label: 'Active Sessions', value: stats.scheduledSessions, icon: Camera, color: '#22C55E' },
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#D4A853' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-5 rounded-xl bg-[#161616] border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Revenue Card */}
          {stats.totalRevenue > 0 && (
            <motion.div
              className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[#C45D3E]/20 to-[#D4A853]/20 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 mb-1">Total Revenue</p>
                  <p className="text-4xl font-bold text-gradient-warm">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[#D4A853]/20 flex items-center justify-center">
                  <IndianRupee className="w-8 h-8 text-[#D4A853]" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Links */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            {[
              { label: 'Bookings', href: '/admin/bookings', icon: Calendar, count: stats.pendingBookings },
              { label: 'Sessions', href: '/admin/sessions', icon: Camera },
              { label: 'Messages', href: '/admin/messages', icon: MessageCircle, count: stats.unreadMessages },
              { label: 'Users', href: '/admin/users', icon: Users },
              { label: 'Gallery', href: '/admin/gallery', icon: Image },
              { label: 'Reports', href: '/admin/reports', icon: FileSpreadsheet }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative p-4 rounded-xl bg-[#161616] border border-white/5 hover:border-[#C45D3E]/30 transition-all group"
              >
                <link.icon className="w-6 h-6 text-[#C45D3E] mb-2" />
                <p className="text-white font-medium">{link.label}</p>
                {link.count > 0 && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#C45D3E] text-white text-xs font-bold rounded-full">
                    {link.count}
                  </span>
                )}
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-white/20 group-hover:text-[#C45D3E] transition-colors" />
              </Link>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <motion.div
              className="bg-[#161616] rounded-xl border border-white/5 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white">Recent Bookings</h3>
                <Link href="/admin/bookings" className="text-sm text-[#C45D3E] hover:underline">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <div key={booking._id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white">{booking.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/40">
                        <span className="capitalize">{booking.sessionType}</span>
                        <span>{formatDate(booking.date)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/40">
                    No bookings yet
                  </div>
                )}
              </div>
            </motion.div>

            {/* Upcoming Sessions */}
            <motion.div
              className="bg-[#161616] rounded-xl border border-white/5 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white">Upcoming Sessions</h3>
                <Link href="/admin/sessions" className="text-sm text-[#C45D3E] hover:underline">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-white/5">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <div key={session._id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-white">{session.client?.name || 'Unknown Client'}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/40">
                        <span>{session.sessionType}</span>
                        <span>{formatDate(session.date)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/40">
                    No upcoming sessions
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}