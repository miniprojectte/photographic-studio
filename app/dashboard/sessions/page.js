'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, Plus, Filter, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/BookingForm';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800'
};

const sessionTypeLabels = {
  portrait: 'Portrait Session',
  wedding: 'Wedding Photography',
  family: 'Family Photos',
  event: 'Event Photography',
  commercial: 'Commercial Shoot'
};

export default function Sessions() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    sessionType: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchBookings();
  }, [filters, pagination.page]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.sessionType && { sessionType: filters.sessionType })
      });

      const response = await fetch(`http://localhost:5000/api/bookings/my-bookings?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        let filteredBookings = data.data;
        
        // Apply client-side search filter
        if (filters.search) {
          filteredBookings = filteredBookings.filter(booking =>
            booking.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            booking.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            booking.sessionType.toLowerCase().includes(filters.search.toLowerCase())
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
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingCreated = (newBooking) => {
    setBookings(prev => [newBooking, ...prev]);
    setShowForm(false);
    fetchBookings(); // Refresh the list to get updated pagination
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filtering
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setBookings(bookings.filter(booking => booking._id !== id));
        if (window.notify) {
          window.notify.success('Booking cancelled successfully', {
            title: 'Success'
          });
        } else {
          alert('Booking cancelled successfully');
        }
      } else {
        const errorMessage = data.message || 'Failed to cancel booking';
        if (window.notify) {
          window.notify.error(errorMessage, {
            title: 'Error'
          });
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      const errorMessage = 'An error occurred while cancelling the booking';
      if (window.notify) {
        window.notify.error(errorMessage, {
          title: 'Error'
        });
      } else {
        alert(errorMessage);
      }
    }
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
      {showForm ? (
        <BookingForm 
          onBookingCreated={handleBookingCreated}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600 mt-1">Manage your photography session bookings</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Booking
              </Button>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="inline h-4 w-4 mr-1" />
                  Search
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by name, email..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
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

              {/* Session Type Filter */}
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

              {/* Reset Filters */}
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({ status: '', sessionType: '', search: '' });
                    setPagination(prev => ({ ...prev, page: 1 }));
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400 mt-2">Create your first booking to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {sessionTypeLabels[booking.sessionType]}
                      </h3>
                      <p className="text-gray-600 mt-1">{booking.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(booking._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{new Date(booking.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{booking.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{booking.email}</span>
                      </div>
                      {booking.notes && (
                        <div className="flex items-start text-gray-600">
                          <MessageSquare className="h-4 w-4 mr-2 mt-1" />
                          <span className="text-sm">{booking.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
