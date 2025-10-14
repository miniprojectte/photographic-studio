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
  Phone,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200'
};

const sessionTypeLabels = {
  portrait: 'Portrait Session',
  wedding: 'Wedding Photography',
  family: 'Family Photos',
  event: 'Event Photography',
  commercial: 'Commercial Shoot'
};

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    sessionType: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });

  useEffect(() => {
    // Check admin access
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadBookings();
    loadStats();
  }, [router, pagination.page, filters]);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.sessionType && { sessionType: filters.sessionType }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`http://localhost:5000/api/bookings/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        let filteredBookings = data.data;
        
        // Apply client-side search
        if (searchTerm) {
          filteredBookings = filteredBookings.filter(booking =>
            booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.sessionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setBookings(filteredBookings);
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total,
            pages: data.pagination.pages
          }));
        }
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/bookings/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating booking status:', { bookingId, newStatus, token: token ? 'present' : 'missing' });
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // Update the booking in the list
        setBookings(prev => prev.map(booking =>
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        
        // Reload stats
        loadStats();
        if (window.notify) {
          window.notify.success(`Booking status updated to ${newStatus}`, {
            title: 'Status Updated'
          });
        } else {
          alert(`Booking status updated to ${newStatus}`);
        }
      } else {
        const errorMessage = data.message || 'Failed to update booking status';
        if (window.notify) {
          window.notify.error(errorMessage, {
            title: 'Update Failed'
          });
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      let errorMessage = 'An error occurred while updating the booking status';
      
      if (error.message.includes('403') || error.message.includes('Access denied')) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (window.notify) {
        window.notify.error(errorMessage, {
          title: 'Update Failed'
        });
      } else {
        alert(errorMessage);
      }
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        loadStats();
        if (window.notify) {
          window.notify.success('Booking deleted successfully', {
            title: 'Success'
          });
        } else {
          alert('Booking deleted successfully');
        }
      } else {
        const errorMessage = data.message || 'Failed to delete booking';
        if (window.notify) {
          window.notify.error(errorMessage, {
            title: 'Delete Failed'
          });
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      const errorMessage = 'An error occurred while deleting the booking';
      if (window.notify) {
        window.notify.error(errorMessage, {
          title: 'Error'
        });
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      sessionType: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
            <p className="text-gray-600">Manage all photography session bookings</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              loadBookings();
              loadStats();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingBookings}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedBookings}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="inline h-4 w-4 mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookings..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type
            </label>
            <select
              value={filters.sessionType}
              onChange={(e) => handleFilterChange('sessionType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="portrait">Portrait</option>
              <option value="wedding">Wedding</option>
              <option value="family">Family</option>
              <option value="event">Event</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">
              {Object.values(filters).some(f => f) || searchTerm ? 
                "No bookings match your current filters." : 
                "No bookings have been made yet."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.name}</div>
                          {booking.user && (
                            <div className="text-sm text-gray-500">User: {booking.user.name}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {booking.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {booking.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sessionTypeLabels[booking.sessionType]}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(booking.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {formatDate(booking.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Status Update Buttons */}
                        {booking.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Confirm
                          </Button>
                        )}
                        
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking._id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                        
                        {/* Delete Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteBooking(booking._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            
            <span className="px-3 py-1 text-sm text-gray-700">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            
            <Button
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}