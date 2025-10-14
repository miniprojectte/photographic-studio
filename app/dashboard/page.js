'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LogOut,
  User,
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
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Photography Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-gray-700 hover:text-red-600"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Overview Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <User className="h-8 w-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-semibold">Account Overview</h2>
                  <p className="text-gray-600">Welcome back, {user?.name}</p>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                className="text-blue-600 hover:text-blue-700 flex items-center"
              >
                Edit Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600">Email: {user?.email}</p>
                <p className="text-gray-600">Next Session: Tomorrow at 2 PM</p>
                <p className="text-gray-600">Pending Actions: 2</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">Active Projects: 3</p>
                <p className="text-gray-600">Completed Sessions: 12</p>
                <p className="text-gray-600">Last Login: Today at 9:00 AM</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Book New Session</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-3">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span>Message Studio</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start space-x-3">
                <Image className="h-5 w-5 text-blue-600" />
                <span>View Gallery</span>
              </Button>
            </div>
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
              </div>
              <Link
                href="/dashboard/sessions"
                className="text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {/* Sample upcoming sessions */}
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">Wedding Photography</p>
                <p className="text-sm text-gray-600">Tomorrow at 2:00 PM</p>
                <p className="text-sm text-gray-600">Central Park</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <p className="font-medium">Family Portrait</p>
                <p className="text-sm text-gray-600">Aug 15, 2025 at 10:00 AM</p>
                <p className="text-sm text-gray-600">Studio</p>
              </div>
            </div>
          </motion.div>

          {/* Project Timeline */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md lg:col-span-2"
          >
            <div className="flex items-center space-x-4 mb-6">
              <FileText className="h-8 w-8 text-blue-600" />
              <h2 className="text-xl font-semibold">Project Timeline</h2>
            </div>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full h-8 w-8 bg-green-500 text-white flex items-center justify-center">✓</div>
                  <div className="h-full border-l border-gray-300 mx-4"></div>
                </div>
                <div>
                  <p className="font-medium">Session Completed</p>
                  <p className="text-sm text-gray-600">Photos are being edited</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full h-8 w-8 bg-blue-500 text-white flex items-center justify-center">⋯</div>
                  <div className="h-full border-l border-gray-300 mx-4"></div>
                </div>
                <div>
                  <p className="font-medium">Editing in Progress</p>
                  <p className="text-sm text-gray-600">Estimated completion: 3 days</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full h-8 w-8 bg-gray-300 text-white flex items-center justify-center">3</div>
                </div>
                <div>
                  <p className="font-medium">Final Delivery</p>
                  <p className="text-sm text-gray-600">Scheduled for Aug 20, 2025</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Photo Gallery Preview */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Image className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">Photo Gallery</h2>
              </div>
              <Link
                href="/dashboard/gallery"
                className="text-blue-600 hover:text-blue-700"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {/* Sample gallery previews */}
              <div className="aspect-square bg-gray-100 rounded-lg"></div>
              <div className="aspect-square bg-gray-100 rounded-lg"></div>
              <div className="aspect-square bg-gray-100 rounded-lg"></div>
            </div>
            <p className="text-sm text-gray-600 mt-4">Recent Uploads: 24 new photos</p>
          </motion.div>


          {/* Communication Center */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
                <h2 className="text-xl font-semibold">Communication Center</h2>
              </div>
              <Link
                href="/dashboard/messages"
                className="text-blue-600 hover:text-blue-700"
              >
                View All Messages
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Recent Messages</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">Location Update</p>
                    <p className="text-sm text-gray-600">2 hours ago</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">Outfit Suggestions</p>
                    <p className="text-sm text-gray-600">Yesterday</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Notifications</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium">Session Reminder</p>
                    <p className="text-sm text-gray-600">Tomorrow at 2 PM</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium">Photos Ready</p>
                    <p className="text-sm text-gray-600">Review your recent shoot</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Quick Actions</h3>
                <div className="space-y-2">
                  <Button className="w-full">
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Call
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
