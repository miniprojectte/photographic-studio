'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sessionsAPI, bookingsAPI } from '../utils/api';
import {
  LogOut,
  Calendar,
  Camera,
  ArrowRight,
  Image as ImageIcon,
  MessageCircle,
  Shield,
  Clock,
  Star,
  Download,
  MapPin,
  Bell,
  Plus,
  Aperture,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalSessions: 0,
    photosDelivered: 0,
    upcomingSessions: 0,
    satisfaction: 0,
    sessions: [],
    recentActivity: [],
    messages: []
  });

  const fetchDashboardData = async (token) => {
    try {
      const [sessionsData, bookingsData] = await Promise.all([
        sessionsAPI.getUserSessions(),
        bookingsAPI.getUserBookings()
      ]);

      const sessions = sessionsData.sessions || [];
      const bookings = bookingsData.bookings || [];

      const normalizedSessions = sessions.map((s) => ({
        _id: s._id,
        source: 'session',
        sessionType: s.sessionType || 'Session',
        status: (s.status || '').toLowerCase().replace(/\s+/g, '-'),
        date: s.date ? new Date(s.date) : null,
        location: s.location?.address || s.location || 'Studio',
        title: s.title || `${s.sessionType || 'Session'} Photography`
      }));

      const normalizedBookings = bookings.map((b) => ({
        _id: b._id,
        source: 'booking',
        sessionType: b.sessionType ? b.sessionType.charAt(0).toUpperCase() + b.sessionType.slice(1) : 'Session',
        status: (function mapBookingStatus(status) {
          const s = (status || '').toLowerCase();
          if (s === 'completed') return 'completed';
          if (s === 'cancelled') return 'cancelled';
          return 'scheduled';
        })(b.status),
        date: b.date ? new Date(b.date) : null,
        location: b.location || 'Studio',
        title: b.title || `${b.sessionType ? b.sessionType.charAt(0).toUpperCase() + b.sessionType.slice(1) : 'Session'} Photography`
      }));

      const combinedItems = [...normalizedSessions, ...normalizedBookings]
        .filter(i => i.date instanceof Date && !isNaN(i.date))
        .sort((a, b) => b.date - a.date);

      const totalSessions = combinedItems.length;
      const now = new Date();
      const upcomingSessions = combinedItems.filter(i => i.date > now && i.status === 'scheduled').length;
      const photosDelivered = combinedItems.filter(i => i.status === 'completed').length * 85;
      const satisfaction = 4.9;

      setDashboardData({
        totalSessions,
        photosDelivered,
        upcomingSessions,
        satisfaction,
        sessions: combinedItems.slice(0, 3),
        recentActivity: [],
        messages: []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchDashboardData(token);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';

  const stats = [
    {
      label: 'Total Sessions',
      value: dashboardData.totalSessions,
      icon: Camera,
      gradient: 'from-[#C45D3E] to-[#A04A2F]'
    },
    {
      label: 'Photos Delivered',
      value: dashboardData.photosDelivered.toLocaleString(),
      icon: ImageIcon,
      gradient: 'from-[#D4A853] to-[#B8923E]'
    },
    {
      label: 'Upcoming',
      value: dashboardData.upcomingSessions,
      icon: Calendar,
      gradient: 'from-[#C45D3E] to-[#A04A2F]'
    },
    {
      label: 'Rating',
      value: dashboardData.satisfaction,
      icon: Star,
      gradient: 'from-[#D4A853] to-[#B8923E]',
      suffix: '/5'
    }
  ];

  const quickActions = [
    { label: 'Book New Session', icon: Plus, href: '/booking', primary: true },
    { label: 'My Sessions', icon: Calendar, href: '/dashboard/sessions' },
    { label: 'Photo Gallery', icon: LayoutGrid, href: '/dashboard/gallery' },
    { label: 'Messages', icon: MessageCircle, href: '/dashboard/messages' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center">
                <Aperture className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">MN Studio</h1>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#D4A853] -mt-0.5">Client Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification bell */}
              <button className="relative p-2 text-white/50 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C45D3E] rounded-full" />
              </button>

              {/* User info */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8923E] flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-white/40">{isAdmin ? 'Administrator' : 'Client'}</p>
                </div>
                {isAdmin && (
                  <span className="px-2 py-0.5 bg-[#C45D3E]/20 text-[#C45D3E] text-[10px] font-medium rounded-full uppercase tracking-wider">
                    Admin
                  </span>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-white/40 hover:text-[#C45D3E] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="text-gradient-warm">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-white/50">Here's what's happening with your photography journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative p-6 rounded-2xl bg-[#161616] border border-white/5 overflow-hidden group hover:border-[#C45D3E]/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.gradient}`} />

              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient}/20 flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-[#C45D3E]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                {stat.value}{stat.suffix && <span className="text-lg text-white/40">{stat.suffix}</span>}
              </p>
              <p className="text-sm text-white/40">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Sessions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upcoming Sessions */}
            <motion.div
              className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C45D3E]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#C45D3E]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Upcoming Sessions</h2>
                </div>
                <Link
                  href="/dashboard/sessions"
                  className="text-sm text-[#C45D3E] hover:text-[#D97B5D] flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="divide-y divide-white/5">
                {dashboardData.sessions.length > 0 ? (
                  dashboardData.sessions.map((session, index) => {
                    const sessionDate = session.date instanceof Date ? session.date : new Date(session.date);
                    const statusColors = {
                      'scheduled': 'bg-[#D4A853]/20 text-[#D4A853]',
                      'in-progress': 'bg-[#C45D3E]/20 text-[#C45D3E]',
                      'completed': 'bg-green-500/20 text-green-400'
                    };

                    return (
                      <div key={session._id || index} className="p-6 hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2.5 py-1 bg-white/5 text-white/70 text-xs font-medium rounded-lg capitalize">
                                {session.sessionType}
                              </span>
                              <span className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize ${statusColors[session.status] || 'bg-white/5 text-white/50'}`}>
                                {session.status}
                              </span>
                            </div>
                            <h3 className="font-medium text-white mb-2">{session.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-white/40">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {sessionDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {session.location}
                              </div>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-white/20" />
                    </div>
                    <h3 className="font-medium text-white mb-2">No Upcoming Sessions</h3>
                    <p className="text-sm text-white/40 mb-6">Ready to capture some amazing moments?</p>
                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-[#C45D3E]/20 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Book Your First Session
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <motion.div
              className="bg-[#161616] rounded-2xl border border-white/5 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${action.primary
                        ? 'bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white hover:shadow-lg hover:shadow-[#C45D3E]/20'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <action.icon className="w-5 h-5" />
                    <span className="font-medium">{action.label}</span>
                    <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Photos */}
            <motion.div
              className="bg-[#161616] rounded-2xl border border-white/5 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Recent Photos</h2>
                <Link href="/dashboard/gallery" className="text-sm text-[#C45D3E] hover:text-[#D97B5D]">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="aspect-square bg-white/5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
                    onClick={() => router.push('/dashboard/gallery')}
                  >
                    <ImageIcon className="w-6 h-6 text-white/20" />
                  </div>
                ))}
              </div>

              {dashboardData.photosDelivered > 0 && (
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm rounded-xl transition-colors">
                  <Download className="w-4 h-4" />
                  Download All Photos
                </button>
              )}
            </motion.div>

            {/* Admin Access (if admin) */}
            {isAdmin && (
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-[#C45D3E]/20 via-[#161616] to-[#D4A853]/10 border border-[#C45D3E]/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C45D3E]/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#C45D3E]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Admin Access</h3>
                    <p className="text-xs text-white/40">Manage studio operations</p>
                  </div>
                </div>
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 py-3 bg-[#C45D3E] hover:bg-[#D97B5D] text-white font-medium rounded-xl transition-colors"
                >
                  Go to Admin Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}