// Test script to check admin access
const token = process.argv[2];

if (!token) {
  console.log('Usage: node test-admin-access.js <jwt_token>');
  process.exit(1);
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('Token decoded successfully:');
  console.log('User ID:', decoded.id);
  console.log('Token issued at:', new Date(decoded.iat * 1000));
  console.log('Token expires at:', new Date(decoded.exp * 1000));
  
  // Connect to database and check user
  const mongoose = require('mongoose');
  const User = require('./app/backend/models/userModel');
  
  mongoose.connect(process.env.MONGO_URI).then(async () => {
    const user = await User.findById(decoded.id);
    if (user) {
      console.log('User found:');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Is Admin:', user.role === 'admin');
    } else {
      console.log('User not found in database');
    }
    process.exit(0);
  }).catch(err => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });
  
} catch (error) {
  console.error('Token verification failed:', error.message);
  process.exit(1);
}