'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProtection({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const userType = localStorage.getItem('userType');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        
        // Check if user has admin role
        if (parsedUser.role === 'admin' || userType === 'admin') {
          setIsAuthorized(true);
        } else {
          router.push('/dashboard'); // Redirect to user dashboard
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push('/login');
        return;
      }

      setLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will be redirected by useEffect
  }

  return children;
}