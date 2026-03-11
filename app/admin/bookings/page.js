'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { bookingsAPI, sessionsAPI } from '@/app/utils/api';
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Filter,
  MoreVertical,
  Eye,
  Trash2,
  Camera,
  X
} from 'lucide-react';

const statusOptions = ['pending', 'confirmed', 'cancelled', 'completed'];

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingsAPI.getAllBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdating(true);
      await bookingsAPI.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: newStatus } : b
      ));
      if (selectedBooking?._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update booking status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await bookingsAPI.deleteBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      if (selectedBooking?._id === bookingId) {
        setShowModal(false);
        setSelectedBooking(null);
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Failed to delete booking');
    }
  };

  const handleCreateSession = async (booking) => {
    try {
      setUpdating(true);
      await sessionsAPI.createFromBooking(booking._id, {
        price: 0,
        location: { type: 'studio' }
      });

      // Update booking status to confirmed
      await bookingsAPI.updateBookingStatus(booking._id, 'confirmed');
      setBookings(bookings.map(b =>
        b._id === booking._id ? { ...b, status: 'confirmed' } : b
      ));

      alert('Session created successfully!');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    } finally {
      setUpdating(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.sessionType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Loading bookings...</p>
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
          <div
            className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(196,93,62,0.4) 0%, rgba(196,93,62,0) 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.35) 0%, rgba(212,168,83,0) 70%)' }}
          />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Admin</span>
              </Link>
              <button
                onClick={loadBookings}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
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
            <h1 className="text-3xl font-bold text-white mb-2">Manage Bookings</h1>
            <p className="text-white/50">View and manage all booking requests</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[
              { label: 'Total', value: stats.total, color: 'white' },
              { label: 'Pending', value: stats.pending, color: '#EAB308' },
              { label: 'Confirmed', value: stats.confirmed, color: '#22C55E' },
              { label: 'Cancelled', value: stats.cancelled, color: '#EF4444' }
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-[#161616] border border-white/5">
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                placeholder="Search by name, email, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#161616] border border-white/5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {['all', ...statusOptions].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filterStatus === status
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Bookings Table */}
          <motion.div
            className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Client</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Type</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        className="hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.02 }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center text-white font-semibold text-sm">
                              {booking.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-white">{booking.name}</p>
                              <p className="text-xs text-white/40">{booking.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="capitalize text-white/70">{booking.sessionType}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-white/70">{formatDate(booking.date)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                              className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-white/50" />
                            </button>
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => handleCreateSession(booking)}
                                disabled={updating}
                                className="p-2 bg-[#C45D3E]/20 hover:bg-[#C45D3E]/30 rounded-lg transition-colors"
                                title="Create Session"
                              >
                                <Camera className="w-4 h-4 text-[#C45D3E]" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(booking._id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <h3 className="text-lg font-medium text-white mb-1">No Bookings Found</h3>
                <p className="text-white/50">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No bookings have been made yet'}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Booking Detail Modal */}
        <AnimatePresence>
          {showModal && selectedBooking && (
            <motion.div
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="bg-[#161616] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Booking Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white/50" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Client Info */}
                  <div className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-sm font-medium text-white/40 mb-3">Client Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center text-white font-bold">
                          {selectedBooking.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{selectedBooking.name}</p>
                          <p className="text-sm text-white/40">{selectedBooking.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Phone className="w-4 h-4" />
                        <span>{selectedBooking.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-sm font-medium text-white/40 mb-3">Booking Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/40">Session Type</p>
                        <p className="text-white capitalize">{selectedBooking.sessionType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Date & Time</p>
                        <p className="text-white">{formatDate(selectedBooking.date)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-white/40">Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {getStatusIcon(selectedBooking.status)}
                          {selectedBooking.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {selectedBooking.message && (
                    <div className="p-4 rounded-xl bg-white/5">
                      <h4 className="text-sm font-medium text-white/40 mb-2">Message</h4>
                      <p className="text-white/70">{selectedBooking.message}</p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-sm font-medium text-white/40 mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedBooking._id, status)}
                          disabled={updating || selectedBooking.status === status}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${selectedBooking.status === status
                            ? 'bg-[#C45D3E] text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                            } disabled:opacity-50`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    {selectedBooking.status === 'pending' && (
                      <button
                        onClick={() => handleCreateSession(selectedBooking)}
                        disabled={updating}
                        className="flex-1 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Create Session
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(selectedBooking._id)}
                      className="py-3 px-6 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminProtection>
  );
}