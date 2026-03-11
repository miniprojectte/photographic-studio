'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { sessionsAPI } from '@/app/utils/api';
import {
  ArrowLeft,
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  RefreshCw,
  CheckCircle,
  XCircle,
  PlayCircle,
  X,
  Trash2,
  Edit,
  IndianRupee
} from 'lucide-react';

const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const sessionTypes = ['Portrait', 'Wedding', 'Family', 'Event', 'Commercial'];

export default function AdminSessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsRes, statsRes] = await Promise.all([
        sessionsAPI.getAllSessions(),
        sessionsAPI.getAdminStats()
      ]);
      setSessions(sessionsRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (sessionId, newStatus) => {
    try {
      setUpdating(true);
      await sessionsAPI.updateSessionStatus(sessionId, newStatus);
      setSessions(sessions.map(s =>
        s._id === sessionId ? { ...s, status: newStatus } : s
      ));
      if (selectedSession?._id === sessionId) {
        setSelectedSession({ ...selectedSession, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update session status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await sessionsAPI.deleteSession(sessionId);
      setSessions(sessions.filter(s => s._id !== sessionId));
      if (selectedSession?._id === sessionId) {
        setShowModal(false);
        setSelectedSession(null);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch =
      session.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.sessionType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      case 'Scheduled': return 'bg-[#C45D3E]/20 text-[#C45D3E]';
      case 'In Progress': return 'bg-blue-500/20 text-blue-400';
      case 'Completed': return 'bg-green-500/20 text-green-400';
      case 'Cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <PlayCircle className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Loading sessions...</p>
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
                onClick={loadData}
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
            <h1 className="text-3xl font-bold text-white mb-2">Manage Sessions</h1>
            <p className="text-white/50">View and manage all photography sessions</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {[
              { label: 'Total', value: stats.totalSessions || 0, color: 'white' },
              { label: 'Scheduled', value: stats.scheduledSessions || 0, color: '#C45D3E' },
              { label: 'In Progress', value: stats.inProgressSessions || 0, color: '#3B82F6' },
              { label: 'Completed', value: stats.completedSessions || 0, color: '#22C55E' },
              { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, color: '#D4A853', icon: IndianRupee }
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
                placeholder="Search by client or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#161616] border border-white/5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] transition-colors"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterStatus === 'all'
                  ? 'bg-[#C45D3E] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
              >
                All
              </button>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${filterStatus === status
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Sessions Grid */}
          {filteredSessions.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session._id}
                  className="p-5 rounded-xl bg-[#161616] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  onClick={() => { setSelectedSession(session); setShowModal(true); }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center text-white font-semibold text-sm">
                        {session.client?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{session.client?.name || 'Unknown'}</p>
                        <p className="text-xs text-white/40">{session.sessionType}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      {session.status}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/50">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    {session.location?.address && (
                      <div className="flex items-center gap-2 text-white/50">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{session.location.address}</span>
                      </div>
                    )}
                    {session.price > 0 && (
                      <div className="flex items-center gap-2 text-[#D4A853]">
                        <IndianRupee className="w-4 h-4" />
                        <span>₹{session.price.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                    {session.status === 'Scheduled' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(session._id, 'In Progress'); }}
                        className="flex-1 py-2 bg-blue-500/20 text-blue-400 text-sm font-medium rounded-lg hover:bg-blue-500/30 transition-colors"
                      >
                        Start
                      </button>
                    )}
                    {session.status === 'In Progress' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(session._id, 'Completed'); }}
                        className="flex-1 py-2 bg-green-500/20 text-green-400 text-sm font-medium rounded-lg hover:bg-green-500/30 transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(session._id); }}
                      className="py-2 px-3 bg-red-500/10 text-red-400 text-sm rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-[#161616] rounded-2xl border border-white/5">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <h3 className="text-lg font-medium text-white mb-1">No Sessions Found</h3>
              <p className="text-white/50">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Create sessions from confirmed bookings'}
              </p>
            </div>
          )}
        </div>

        {/* Session Detail Modal */}
        <AnimatePresence>
          {showModal && selectedSession && (
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
                  <h2 className="text-xl font-bold text-white">Session Details</h2>
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
                    <h4 className="text-sm font-medium text-white/40 mb-3">Client</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center text-white font-bold">
                        {selectedSession.client?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{selectedSession.client?.name || 'Unknown'}</p>
                        <p className="text-sm text-white/40">{selectedSession.client?.email || 'No email'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Info */}
                  <div className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-sm font-medium text-white/40 mb-3">Session Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/40">Type</p>
                        <p className="text-white">{selectedSession.sessionType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Date</p>
                        <p className="text-white">{formatDate(selectedSession.date)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Status</p>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 mt-1 rounded-full text-xs font-medium ${getStatusColor(selectedSession.status)}`}>
                          {getStatusIcon(selectedSession.status)}
                          {selectedSession.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-white/40">Price</p>
                        <p className="text-[#D4A853] font-medium">₹{(selectedSession.price || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedSession.notes && (
                    <div className="p-4 rounded-xl bg-white/5">
                      <h4 className="text-sm font-medium text-white/40 mb-2">Notes</h4>
                      <p className="text-white/70 text-sm whitespace-pre-wrap">{selectedSession.notes}</p>
                    </div>
                  )}

                  {/* Status Update */}
                  <div className="p-4 rounded-xl bg-white/5">
                    <h4 className="text-sm font-medium text-white/40 mb-3">Update Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedSession._id, status)}
                          disabled={updating || selectedSession.status === status}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSession.status === status
                            ? 'bg-[#C45D3E] text-white'
                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                            } disabled:opacity-50`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(selectedSession._id)}
                    className="w-full py-3 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-colors"
                  >
                    Delete Session
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminProtection>
  );
}