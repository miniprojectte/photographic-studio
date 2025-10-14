'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import {
  LogOut,
  Users,
  Calendar,
  Settings,
  Camera,
  ArrowRight,
  Image,
  FileText,
  MessageCircle,
  Share2,
  Shield,
  CreditCard,
  Bell,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedSessions: 0
  });

  useEffect(() => {
    // Check for token and admin role
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    
    // Check if user is admin
    if (parsedUser.role !== 'admin' && userType !== 'admin') {
      router.push('/dashboard'); // Redirect to regular dashboard
      return;
    }

    setUser(parsedUser);
    loadStats();
    setLoading(false);
  }, [router]);

  const loadStats = async () => {
    // Placeholder stats - you can implement API calls here
    setStats({
      totalUsers: 42,
      totalBookings: 156,
      pendingBookings: 8,
      completedSessions: 134
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AdminProtection>
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navigation */}
      <nav className="bg-red-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-white mr-3" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-red-100">Welcome, {user?.name}</span>
              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">Admin</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-100 hover:text-white hover:bg-red-500"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
              </div>
              <Bell className="h-12 w-12 text-orange-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completedSessions}</p>
              </div>
              <Camera className="h-12 w-12 text-purple-600" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Actions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md lg:col-span-1"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-red-600" />
              Admin Actions
            </h2>
            <div className="space-y-3">
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4" />
                  Manage Bookings
                </Button>
              </Link>
              <Link href="/admin/sessions">
                <Button variant="ghost" className="w-full justify-start">
                  <Camera className="h-4 w-4" />
                  Manage Sessions
                </Button>
              </Link>
              <Link href="/admin/gallery">
                <Button variant="ghost" className="w-full justify-start">
                  <Image className="h-4 w-4" />
                  Manage Gallery
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4" />
                  Reports & Analytics
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-600">john.doe@email.com - 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New booking request</p>
                  <p className="text-sm text-gray-600">Wedding session - 4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <Camera className="h-8 w-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Session completed</p>
                  <p className="text-sm text-gray-600">Portrait session with Sarah - 1 day ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add User</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>New Booking</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>System Settings</span>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* User Dashboard Link */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
              <Eye className="h-4 w-4" />
              View User Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </AdminProtection>
  );
}