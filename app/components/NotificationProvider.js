'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const notificationIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const notificationColors = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

const iconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
};

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
}

export function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = notificationIcons[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.3 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.3 }}
              transition={{ duration: 0.3 }}
              className={`rounded-lg border p-4 shadow-lg backdrop-blur-sm ${notificationColors[notification.type]}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Icon className={`h-5 w-5 ${iconColors[notification.type]}`} />
                </div>
                
                <div className="ml-3 flex-1">
                  {notification.title && (
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                  )}
                  <p className="text-sm">{notification.message}</p>
                </div>
                
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => onRemove(notification.id)}
                    className="inline-flex rounded-md hover:opacity-70 focus:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default function NotificationProvider({ children }) {
  const { notifications, addNotification, removeNotification, clearAll } = useNotifications();

  // Expose notification functions globally
  useEffect(() => {
    window.notify = {
      success: (message, options = {}) => addNotification({ type: 'success', message, ...options }),
      error: (message, options = {}) => addNotification({ type: 'error', message, ...options }),
      warning: (message, options = {}) => addNotification({ type: 'warning', message, ...options }),
      info: (message, options = {}) => addNotification({ type: 'info', message, ...options })
    };

    return () => {
      delete window.notify;
    };
  }, [addNotification]);

  return (
    <>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </>
  );
}