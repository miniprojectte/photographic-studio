'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { sessionsAPI, bookingsAPI } from '../utils/api';
import {
  LogOut,
  User,
  Calendar,
  Settings,
  Camera,
  ArrowRight,
  Image as ImageIcon,
  FileText,
  MessageCircle,
  Share2,
  Shield,
  CreditCard,
  Bell,
  Clock,
  CheckCircle,
  Star,
  Download,
  Eye,
  Heart,
  TrendingUp,
  Award,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      // Fetch user sessions and bookings using API utility
      const [sessionsData, bookingsData] = await Promise.all([
        sessionsAPI.getUserSessions(),
        bookingsAPI.getUserBookings()
      ]);
      
      const sessions = sessionsData.sessions || [];
      const bookings = bookingsData.bookings || [];

      // Calculate stats
      const totalSessions = sessions.length + bookings.length;
      const upcomingSessions = sessions.filter(s => 
        s.status === 'scheduled' && new Date(s.sessionDate) > new Date()
      ).length + bookings.filter(b => 
        new Date(b.sessionDate) > new Date()
      ).length;
      
      // Mock additional data for now
      const photosDelivered = sessions.filter(s => s.status === 'completed').length * 85; // Average photos per session
      const satisfaction = 4.9; // Mock rating

      setDashboardData({
        totalSessions,
        photosDelivered,
        upcomingSessions,
        satisfaction,
        sessions: sessions.slice(0, 3), // Latest 3 sessions
        recentActivity: [
          {
            type: 'photos',
            title: 'Photos Delivered',
            description: 'Your latest session photos are ready for download',
            timestamp: '2 hours ago',
            icon: 'photo'
          },
          {
            type: 'message',
            title: 'New Message',
            description: 'Photographer sent location update',
            timestamp: '1 day ago',
            icon: 'message'
          },
          {
            type: 'booking',
            title: 'Session Booked',
            description: 'Family portrait session confirmed',
            timestamp: '3 days ago',
            icon: 'calendar'
          }
        ],
        messages: [
          {
            title: 'Location Update',
            message: 'Meeting point changed to main entrance',
            timestamp: '2 hours ago',
            unread: true
          },
          {
            title: 'Photos Ready',
            message: 'Your edited photos are available',
            timestamp: 'Yesterday',
            unread: true
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    // Check for token in localStorage
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
  const userType = localStorage.getItem('userType');

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MN Studio
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? 'Administrator' : 'Client'}
                  </p>
                </div>
                {isAdmin && (
                  <span className="px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
          >
            Welcome back, {user?.name}! 👋
          </motion.h1>
          <p className="text-gray-600">Your photography journey continues here</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Sessions</p>
                <p className="text-3xl font-bold">{dashboardData.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Camera className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Photos Delivered</p>
                <p className="text-3xl font-bold">{dashboardData.photosDelivered.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ImageIcon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Upcoming</p>
                <p className="text-3xl font-bold">{dashboardData.upcomingSessions}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Satisfaction</p>
                <div className="flex items-center">
                  <p className="text-3xl font-bold mr-2">{dashboardData.satisfaction}</p>
                  <Star className="h-5 w-5 text-yellow-300 fill-current" />
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Upcoming Sessions</h2>
                </div>
                <Link
                  href="/dashboard/sessions"
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {dashboardData.sessions.length > 0 ? (
                  dashboardData.sessions.map((session, index) => {
                    const sessionDate = new Date(session.sessionDate);
                    const isUpcoming = sessionDate > new Date();
                    const statusColor = session.status === 'scheduled' ? 'blue' : 
                                      session.status === 'in-progress' ? 'amber' : 
                                      session.status === 'completed' ? 'green' : 'gray';
                    
                    return (
                      <div key={session._id || index} className={`bg-gradient-to-r from-${statusColor}-50 to-${statusColor === 'blue' ? 'indigo' : statusColor}-50 p-6 rounded-xl border border-${statusColor}-100`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-3 py-1 bg-${statusColor}-100 text-${statusColor}-800 text-xs font-medium rounded-full capitalize`}>
                                {session.sessionType || 'Session'}
                              </span>
                              <span className={`px-3 py-1 bg-${session.status === 'scheduled' ? 'green' : 'yellow'}-100 text-${session.status === 'scheduled' ? 'green' : 'yellow'}-800 text-xs font-medium rounded-full capitalize`}>
                                {session.status}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">{session.title || `${session.sessionType} Photography`}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {sessionDate.toLocaleDateString()} at {sessionDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {session.location || 'Studio Location'}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className={`bg-${statusColor}-600 hover:bg-${statusColor}-700`}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-100 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">No Upcoming Sessions</h3>
                    <p className="text-sm text-gray-600 mb-4">Ready to capture some amazing moments?</p>
                    <Link href="/contact">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Book Your First Session
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              </div>

              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity, index) => {
                  const iconMap = {
                    photo: CheckCircle,
                    message: MessageCircle,
                    calendar: Calendar
                  };
                  const Icon = iconMap[activity.icon] || CheckCircle;
                  
                  const colorMap = {
                    photo: 'green',
                    message: 'blue', 
                    calendar: 'purple'
                  };
                  const color = colorMap[activity.icon] || 'green';
                  
                  return (
                    <div key={index} className={`flex items-center space-x-4 p-4 bg-${color}-50 rounded-xl`}>
                      <div className={`w-10 h-10 bg-${color}-100 rounded-full flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 text-${color}-600`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                  );
                })}
                
                {dashboardData.recentActivity.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm">No recent activity to display</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              <div className="space-y-3">
                <Link href="/contact" className="block">
                  <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Calendar className="h-4 w-4 mr-3" />
                    Book New Session
                  </Button>
                </Link>
                <Link href="/contact" className="block">
                  <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                    <MessageCircle className="h-4 w-4 mr-3 text-gray-600" />
                    Message Studio
                  </Button>
                </Link>
                <Link href="/dashboard/gallery" className="block">
                  <Button variant="outline" className="w-full justify-start border-gray-200 hover:bg-gray-50">
                    <ImageIcon className="h-4 w-4 mr-3 text-gray-600" />
                    View Gallery
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Photo Gallery Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Photos</h2>
                </div>
                <Link
                  href="/dashboard/gallery"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[1, 2, 3, 4].map((index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square bg-gradient-to-br ${
                      index === 1 ? 'from-blue-100 to-purple-100' :
                      index === 2 ? 'from-pink-100 to-red-100' :
                      index === 3 ? 'from-green-100 to-emerald-100' :
                      'from-amber-100 to-orange-100'
                    } rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:shadow-lg`}
                    onClick={() => router.push('/dashboard/gallery')}
                  >
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{dashboardData.photosDelivered > 0 ? `${Math.min(dashboardData.photosDelivered, 50)} new photos` : 'No photos yet'}</span>
                {dashboardData.photosDelivered > 0 && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() => {
                      // Mock download functionality
                      alert('Download feature will be implemented with real photo storage');
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download All
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Messages Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                </div>
                {dashboardData.messages.filter(m => m.unread).length > 0 && (
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {dashboardData.messages.filter(m => m.unread).length}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {dashboardData.messages.length > 0 ? (
                  dashboardData.messages.map((message, index) => (
                    <div key={index} className={`p-4 bg-${message.unread ? 'blue' : 'green'}-50 rounded-xl border-l-4 border-${message.unread ? 'blue' : 'green'}-500`}>
                      <p className="font-medium text-sm text-gray-900">{message.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{message.message}</p>
                      <span className={`text-xs text-${message.unread ? 'blue' : 'green'}-600 font-medium`}>{message.timestamp}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <MessageCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm">No new messages</p>
                  </div>
                )}
              </div>
              
              <Link href="/contact">
                <Button size="sm" className="w-full mt-4 bg-teal-600 hover:bg-teal-700">
                  Send New Message
                </Button>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Admin Dashboard Link */}
        {isAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-2xl text-white text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="h-8 w-8" />
                <h3 className="text-xl font-bold">Admin Access</h3>
              </div>
              <p className="text-red-100 mb-4">Manage sessions, users, and studio operations</p>
              <Link href="/admin">
                <Button className="bg-white text-red-600 hover:bg-gray-100 font-semibold">
                  Go to Admin Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}