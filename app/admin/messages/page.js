'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import AdminProtection from '@/components/AdminProtection';
import { messagesAPI } from '@/app/utils/api';
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Mail,
  Clock,
  Send,
  RefreshCw,
  User,
  X,
  Check,
  ChevronRight
} from 'lucide-react';

export default function AdminMessages() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getAll();

      // Group messages by sender
      const messagesData = response.data || [];
      const grouped = {};

      messagesData.forEach(message => {
        const senderId = message.sender?._id || 'unknown';
        if (!grouped[senderId]) {
          grouped[senderId] = {
            user: message.sender,
            messages: [],
            lastMessage: null,
            unreadCount: 0
          };
        }
        grouped[senderId].messages.push(message);

        // Track unread count for messages to admin
        if (!message.readAt && message.recipient?.role === 'admin') {
          grouped[senderId].unreadCount++;
        }
      });

      // Sort messages in each conversation and set last message
      Object.values(grouped).forEach(conv => {
        conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        conv.lastMessage = conv.messages[conv.messages.length - 1];
      });

      // Convert to array and sort by last message date
      const conversationList = Object.values(grouped).sort((a, b) =>
        new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
      );

      setConversations(conversationList);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setReplyText('');

    // Mark unread messages as read
    conv.messages.forEach(async (msg) => {
      if (!msg.readAt && msg.recipient?.role === 'admin') {
        try {
          await messagesAPI.markRead(msg._id);
        } catch (e) {
          console.error('Error marking message as read:', e);
        }
      }
    });
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      setSending(true);
      await messagesAPI.adminReply({
        toUserId: selectedConversation.user._id,
        subject: `Re: ${selectedConversation.lastMessage?.subject || 'Your message'}`,
        body: replyText
      });

      // Reload to get the new message
      await loadMessages();
      setReplyText('');

      // Update selected conversation with new messages
      const updated = conversations.find(c => c.user?._id === selectedConversation.user?._id);
      if (updated) {
        setSelectedConversation(updated);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const search = searchQuery.toLowerCase();
    return (
      conv.user?.name?.toLowerCase().includes(search) ||
      conv.user?.email?.toLowerCase().includes(search) ||
      conv.lastMessage?.subject?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatFullDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: conversations.length,
    unread: conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/50">Loading messages...</p>
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
                onClick={loadMessages}
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
                <p className="text-white/50">Manage customer conversations</p>
              </div>
              <div className="flex gap-4">
                <div className="p-4 rounded-xl bg-[#161616] border border-white/5 text-center">
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                  <p className="text-xs text-white/40">Conversations</p>
                </div>
                <div className="p-4 rounded-xl bg-[#161616] border border-white/5 text-center">
                  <p className="text-2xl font-bold text-[#C45D3E]">{stats.unread}</p>
                  <p className="text-xs text-white/40">Unread</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="flex gap-6 h-[calc(100vh-250px)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Conversations List */}
            <div className="w-1/3 min-w-[300px] bg-[#161616] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] text-sm"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv, index) => (
                    <motion.div
                      key={conv.user?._id || index}
                      className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${selectedConversation?.user?._id === conv.user?._id
                        ? 'bg-white/5'
                        : 'hover:bg-white/[0.02]'
                        }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelectConversation(conv)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center text-white font-semibold text-sm">
                            {conv.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C45D3E] text-white text-xs font-bold rounded-full flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-white truncate">{conv.user?.name || 'Unknown'}</p>
                            <span className="text-xs text-white/40">{formatDate(conv.lastMessage?.createdAt)}</span>
                          </div>
                          <p className="text-sm text-white/50 truncate">{conv.lastMessage?.subject}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/20 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center text-white/40">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No conversations found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Conversation Detail */}
            <div className="flex-1 bg-[#161616] rounded-2xl border border-white/5 overflow-hidden flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C45D3E] to-[#A04A2F] flex items-center justify-center text-white font-semibold text-sm">
                      {selectedConversation.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{selectedConversation.user?.name}</p>
                      <p className="text-sm text-white/40">{selectedConversation.user?.email}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConversation.messages.map((msg, index) => {
                      const isFromAdmin = msg.sender?.role === 'admin';
                      return (
                        <motion.div
                          key={msg._id || index}
                          className={`flex ${isFromAdmin ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className={`max-w-[70%] ${isFromAdmin ? 'order-2' : ''}`}>
                            {msg.subject && (
                              <p className={`text-xs mb-1 ${isFromAdmin ? 'text-right text-white/40' : 'text-white/40'}`}>
                                {msg.subject}
                              </p>
                            )}
                            <div className={`p-4 rounded-2xl ${isFromAdmin
                              ? 'bg-[#C45D3E] text-white rounded-br-sm'
                              : 'bg-white/5 text-white rounded-bl-sm'
                              }`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                            </div>
                            <p className={`text-xs mt-1 text-white/30 ${isFromAdmin ? 'text-right' : ''}`}>
                              {formatFullDate(msg.createdAt)}
                              {msg.readAt && <span className="ml-2"><Check className="w-3 h-3 inline" /></span>}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <div className="p-4 border-t border-white/5">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Type your reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E]"
                        disabled={sending}
                      />
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sending}
                        className="px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center">
                  <div>
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-white/10" />
                    <p className="text-white/50">Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminProtection>
  );
}
