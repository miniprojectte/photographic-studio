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
  RefreshCw,
  MapPin,
  DollarSign,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SessionForm from '../../components/SessionForm';

const statusColors = {
  'Scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
  'In Progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200',
  'Cancelled': 'bg-red-100 text-red-800 border-red-200'
};

const sessionTypeLabels = {
  'Wedding': 'Wedding Photography',
  'Portrait': 'Portrait Session',
  'Family': 'Family Photos',
  'Event': 'Event Photography',
  'Commercial': 'Commercial Shoot'
};

export default function AdminSessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
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
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    totalSessions: 0,
    scheduledSessions: 0,
    inProgressSessions: 0,
    completedSessions: 0,
    cancelledSessions: 0,
    totalRevenue: 0,
    upcomingSessions: 0
  });
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);

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

    loadSessions();
    loadStats();
  }, [router, pagination.page, filters]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.sessionType && { sessionType: filters.sessionType }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      });

      const response = await fetch(`http://localhost:5000/api/sessions/admin/all?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        // Apply client-side search filter
        let filteredSessions = data.data;
        if (searchTerm) {
          filteredSessions = data.data.filter(session =>
            session.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.sessionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.location?.city?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setSessions(filteredSessions);
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total,
            pages: data.pagination.pages
          }));
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/sessions/admin/stats', {
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

  const updateSessionStatus = async (sessionId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Updating session status:', { sessionId, newStatus, token: token ? 'present' : 'missing' });
      
      const response = await fetch(`http://localhost:5000/api/sessions/admin/${sessionId}/status`, {
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
        // Update the session in the list
        setSessions(prev => prev.map(session =>
          session._id === sessionId ? { ...session, status: newStatus } : session
        ));
        
        // Reload stats
        loadStats();
        if (window.notify) {
          window.notify.success(`Session status updated to ${newStatus}`, {
            title: 'Status Updated'
          });
        } else {
          alert(`Session status updated to ${newStatus}`);
        }
      } else {
        const errorMessage = data.message || 'Failed to update session status';
        if (window.notify) {
          window.notify.error(errorMessage, {
            title: 'Update Failed'
          });
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error updating session status:', error);
      let errorMessage = 'An error occurred while updating the session status';
      
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

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/sessions/admin/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSessions(prev => prev.filter(session => session._id !== sessionId));
        loadStats();
        if (window.notify) {
          window.notify.success('Session deleted successfully', {
            title: 'Session Deleted'
          });
        } else {
          alert('Session deleted successfully');
        }
      } else {
        if (window.notify) {
          window.notify.error(data.message || 'Failed to delete session', {
            title: 'Delete Failed'
          });
        } else {
          alert(data.message || 'Failed to delete session');
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      if (window.notify) {
        window.notify.error('An error occurred while deleting the session', {
          title: 'Delete Failed'
        });
      } else {
        alert('An error occurred while deleting the session');
      }
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/sessions/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();
      if (data.success) {
        loadSessions();
        loadStats();
        if (window.notify) {
          window.notify.success('Session created successfully', {
            title: 'Session Created'
          });
        } else {
          alert('Session created successfully');
        }
      } else {
        const errorMessage = Array.isArray(data.error) ? data.error.join(', ') : (data.message || 'Failed to create session');
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      if (window.notify) {
        window.notify.error(error.message || 'An error occurred while creating the session', {
          title: 'Creation Failed'
        });
      } else {
        alert(error.message || 'An error occurred while creating the session');
      }
      throw error;
    }
  };

  const handleEditSession = async (sessionData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/sessions/admin/${editingSession._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData)
      });

      const data = await response.json();
      if (data.success) {
        loadSessions();
        loadStats();
        setEditingSession(null);
        if (window.notify) {
          window.notify.success('Session updated successfully', {
            title: 'Session Updated'
          });
        } else {
          alert('Session updated successfully');
        }
      } else {
        const errorMessage = Array.isArray(data.error) ? data.error.join(', ') : (data.message || 'Failed to update session');
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating session:', error);
      if (window.notify) {
        window.notify.error(error.message || 'An error occurred while updating the session', {
          title: 'Update Failed'
        });
      } else {
        alert(error.message || 'An error occurred while updating the session');
      }
      throw error;
    }
  };

  const openEditSession = (session) => {
    setEditingSession(session);
    setShowSessionForm(true);
  };

  const closeSessionForm = () => {
    setShowSessionForm(false);
    setEditingSession(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getFilteredSessions = () => {
    return sessions.filter(session =>
      session.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.sessionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.location?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Session Management</h1>
              <p className="text-gray-600 mt-1">Manage photography sessions and client bookings</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={loadSessions}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button
              onClick={() => setShowSessionForm(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>New Session</span>
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduledSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgressSessions}</p>
              </div>
              <Play className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedSessions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelledSessions}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-purple-600">{stats.upcomingSessions}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Session Type Filter */}
            <select
              value={filters.sessionType}
              onChange={(e) => setFilters(prev => ({ ...prev, sessionType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="Wedding">Wedding</option>
              <option value="Portrait">Portrait</option>
              <option value="Family">Family</option>
              <option value="Event">Event</option>
              <option value="Commercial">Commercial</option>
            </select>

            {/* Date Range Filters */}
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="End Date"
            />
          </div>
        </motion.div>

        {/* Sessions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
            <p className="text-sm text-gray-600">
              Showing {getFilteredSessions().length} of {pagination.total} sessions
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading sessions...</span>
            </div>
          ) : getFilteredSessions().length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No sessions found</h3>
              <p className="mt-2 text-gray-500">
                {searchTerm || Object.values(filters).some(Boolean)
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating your first session.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client & Session
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
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
                  {getFilteredSessions().map((session) => (
                    <tr key={session._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {session.client?.name || 'Unknown Client'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {session.client?.email || 'No email'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {sessionTypeLabels[session.sessionType] || session.sessionType}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(session.date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                          {session.location?.address ? (
                            <>
                              <div>
                                <div>{session.location.address}</div>
                                <div className="text-gray-500">
                                  {session.location.city}, {session.location.state} {session.location.zipCode}
                                </div>
                              </div>
                            </>
                          ) : 'Location TBD'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(session.price || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColors[session.status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {/* Status Update Buttons */}
                          {session.status === 'Scheduled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateSessionStatus(session._id, 'In Progress')}
                              className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                            >
                              <Play className="h-3 w-3" />
                            </Button>
                          )}
                          
                          {session.status === 'In Progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateSessionStatus(session._id, 'Completed')}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3" />
                            </Button>
                          )}

                          {(session.status === 'Scheduled' || session.status === 'In Progress') && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateSessionStatus(session._id, 'Cancelled')}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-3 w-3" />
                            </Button>
                          )}

                          {/* Action Buttons */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-600 hover:text-blue-600"
                            title="View Details"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditSession(session)}
                            className="text-gray-600 hover:text-blue-600"
                            title="Edit Session"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteSession(session._id)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total sessions)
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.pages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Session Form Modal */}
      {showSessionForm && (
        <SessionForm
          session={editingSession}
          onClose={closeSessionForm}
          onSubmit={editingSession ? handleEditSession : handleCreateSession}
        />
      )}
    </div>
  );
}