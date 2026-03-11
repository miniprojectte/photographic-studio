'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { messagesAPI } from '@/app/utils/api';
import {
  ArrowLeft,
  Send,
  Search,
  MessageCircle,
  CheckCheck,
  Loader2,
  RefreshCw
} from 'lucide-react';

export default function DashboardMessages() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [user, setUser] = useState(null);
  const [showNewMessageForm, setShowNewMessageForm] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    loadMessages();
  }, [router]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getMyMessages();
      setMessages(response.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await messagesAPI.sendToAdmin({
        subject: newSubject || 'New Message',
        body: newMessage
      });

      setNewMessage('');
      setNewSubject('');
      setShowNewMessageForm(false);
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messagesAPI.markRead(messageId);
      await loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const isSentByMe = (message) => {
    return message.sender?._id === user?._id || message.sender === user?._id;
  };

  const unreadCount = messages.filter(m => !m.readAt && !isSentByMe(m)).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[#C45D3E] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={loadMessages}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-white/50" />
              </button>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-[#C45D3E] text-white text-sm font-medium rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-white/50">Communicate with MN Studio support</p>
        </motion.div>

        {/* New Message Button - only show when there are existing messages */}
        {!showNewMessageForm && messages.length > 0 && (
          <motion.button
            onClick={() => setShowNewMessageForm(true)}
            className="w-full mb-6 p-4 rounded-xl bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#C45D3E]/20 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MessageCircle className="w-5 h-5" />
            New Message to Support
          </motion.button>
        )}

        {/* New Message Form */}
        {showNewMessageForm && (
          <motion.form
            onSubmit={handleSendMessage}
            className="mb-6 p-6 rounded-2xl bg-[#161616] border border-white/5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Send Message to Support</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Subject (optional)</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Message *</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={4}
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#C45D3E] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowNewMessageForm(false);
                  setNewMessage('');
                  setNewSubject('');
                }}
                className="flex-1 py-3 bg-white/5 text-white/70 font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}

        {/* Messages List */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const sentByMe = isSentByMe(message);
              const isUnread = !message.readAt && !sentByMe;

              return (
                <motion.div
                  key={message._id}
                  className={`p-5 rounded-2xl border transition-all ${sentByMe
                    ? 'bg-[#C45D3E]/10 border-[#C45D3E]/20 ml-8'
                    : 'bg-[#161616] border-white/5 mr-8'
                    } ${isUnread ? 'ring-2 ring-[#D4A853]/30' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => isUnread && handleMarkAsRead(message._id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${sentByMe
                        ? 'bg-[#C45D3E]'
                        : 'bg-gradient-to-br from-[#D4A853] to-[#B8923E]'
                        }`}>
                        {sentByMe
                          ? (user?.name?.charAt(0) || 'Y')
                          : (message.sender?.name?.charAt(0) || 'S')
                        }
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {sentByMe ? 'You' : (message.sender?.name || 'Support')}
                        </p>
                        <p className="text-xs text-white/40">
                          {sentByMe ? 'To: Support' : `From: ${message.sender?.role === 'admin' ? 'Admin' : 'Support'}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="px-2 py-0.5 bg-[#D4A853] text-[#0D0D0D] text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                      <span className="text-xs text-white/40">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  {message.subject && (
                    <p className="text-sm font-medium text-white/70 mb-2">
                      Re: {message.subject}
                    </p>
                  )}

                  {/* Body */}
                  <p className="text-white/80 leading-relaxed">
                    {message.body}
                  </p>

                  {/* Read status */}
                  {sentByMe && message.readAt && (
                    <div className="flex items-center gap-1 mt-3 text-xs text-[#D4A853]">
                      <CheckCheck className="w-3.5 h-3.5" />
                      Read
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Messages Yet</h3>
              <p className="text-white/50 mb-6">
                Start a conversation with our support team.
              </p>
              <button
                onClick={() => setShowNewMessageForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C45D3E] to-[#A04A2F] text-white font-medium rounded-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Send Your First Message
              </button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </motion.div>
      </div>
    </div>
  );
}
