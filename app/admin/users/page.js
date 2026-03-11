'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { authAPI } from '@/app/utils/api';
import {
  ArrowLeft,
  Search,
  User,
  Mail,
  Calendar,
  Shield,
  Users,
  RefreshCw,
  Loader2
} from 'lucide-react';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Loading users...</p>
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
                onClick={loadUsers}
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
            <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
            <p className="text-white/50">View all registered users</p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="p-5 rounded-xl bg-[#161616] border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-sm text-white/40">Total Users</p>
            </div>
            <div className="p-5 rounded-xl bg-[#161616] border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#C45D3E]/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#C45D3E]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#C45D3E]">{stats.admins}</p>
              <p className="text-sm text-white/40">Admins</p>
            </div>
            <div className="p-5 rounded-xl bg-[#161616] border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4A853]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#D4A853]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#D4A853]">{stats.regularUsers}</p>
              <p className="text-sm text-white/40">Clients</p>
            </div>
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
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#161616] border border-white/5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'user', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterRole === role
                    ? 'bg-[#C45D3E] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {role === 'all' ? 'All' : role === 'user' ? 'Clients' : 'Admins'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-white/50">User</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-white/50">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id || index}
                        className="hover:bg-white/[0.02] transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.03 }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${user.role === 'admin'
                              ? 'bg-gradient-to-br from-[#C45D3E] to-[#A04A2F]'
                              : 'bg-gradient-to-br from-[#D4A853] to-[#B8923E]'
                              }`}>
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.name || 'Unknown'}</p>
                              <p className="text-xs text-white/40">ID: {user._id?.slice(-8) || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-white/70">
                            <Mail className="w-4 h-4 text-white/30" />
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                            ? 'bg-[#C45D3E]/20 text-[#C45D3E]'
                            : 'bg-white/5 text-white/60'
                            }`}>
                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                            {user.role === 'admin' ? 'Admin' : 'Client'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            <Calendar className="w-4 h-4" />
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <User className="w-12 h-12 mx-auto mb-4 text-white/20" />
                <h3 className="text-lg font-medium text-white mb-1">No Users Found</h3>
                <p className="text-white/50">
                  {searchQuery || filterRole !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No users have registered yet'}
                </p>
              </div>
            )}
          </motion.div>

          {/* Info Footer */}
          <motion.div
            className="mt-6 text-center text-white/30 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Showing {filteredUsers.length} of {users.length} users
          </motion.div>
        </div>
      </div>
    </AdminProtection>
  );
}