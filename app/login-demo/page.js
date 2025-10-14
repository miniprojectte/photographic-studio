'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCheck, Mail, Lock } from 'lucide-react';

export default function LoginDemo() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'user'
  });

  const handleUserTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      userType: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login attempt with:\nEmail: ${formData.email}\nUser Type: ${formData.userType}`);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login Demo</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>
        </div>

        {/* User Type Dropdown */}
        <div className="relative">
          <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
            Login as
          </label>
          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Select value={formData.userType} onValueChange={handleUserTypeChange}>
              <SelectTrigger className="pl-10 w-full">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">👤 User</SelectItem>
                <SelectItem value="admin">🛡️ Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg">
          Sign In as {formData.userType === 'admin' ? 'Admin' : 'User'}
        </Button>
      </form>

      {/* Current Values Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Form Values:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div><strong>Email:</strong> {formData.email || 'Empty'}</div>
          <div><strong>Password:</strong> {formData.password ? '••••••••' : 'Empty'}</div>
          <div><strong>User Type:</strong> {formData.userType}</div>
        </div>
      </div>
    </div>
  );
}