// Script to list all users and their roles
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

async function listUsers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('-password');

    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      console.log(`Found ${users.length} user(s):`);
      console.log('=' .repeat(50));
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('-'.repeat(30));
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

listUsers();