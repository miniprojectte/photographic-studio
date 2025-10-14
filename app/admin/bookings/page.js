'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check admin access
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin' && userType !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadBookings();
  }, [router]);

  const loadBookings = async () => {
    try {
      // Mock data for demo - replace with actual API call
      setBookings([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1 (555) 123-4567',
          sessionType: 'wedding',
          date: '2025-11-15',
          time: '14:00',
          message: 'Looking forward to our wedding photography session',
          status: 'pending',
          createdAt: '2025-10-10T10:00:00Z'
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@email.com',
          phone: '+1 (555) 987-6543',
          sessionType: 'portrait',
          date: '2025-10-20',
          time: '10:00',
          message: 'Professional headshots needed',
          status: 'confirmed',
          createdAt: '2025-10-08T14:30:00Z'
        },
        {
          _id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@email.com',
          phone: '+1 (555) 456-7890',
          sessionType: 'family',
          date: '2025-10-18',
          time: '16:00',
          message: 'Family reunion photos',
          status: 'completed',
          createdAt: '2025-10-05T09:15:00Z'
        }
      ]);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'cancelled':
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return <Clock className="h-3 w-3 mr-1" />;
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    setBookings(bookings.map(booking =>
      booking._id === bookingId
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.sessionType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Admin
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search bookings by name, email, or session type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking._id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{booking.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{booking.sessionType} Session</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {booking.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {booking.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </div>
              </div>

              {booking.message && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    "{booking.message}"
                  </p>
                </div>
              )}

              {booking.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}

              {booking.status === 'confirmed' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateBookingStatus(booking._id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Complete
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}