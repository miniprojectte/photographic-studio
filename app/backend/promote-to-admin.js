// Script to promote a user to admin role
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');

async function promoteUserToAdmin(email) {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find and update user
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`✅ User ${user.name} (${user.email}) has been promoted to admin`);
    } else {
      console.log(`❌ User with email ${email} not found`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node promote-to-admin.js <user_email>');
  console.log('Example: node promote-to-admin.js admin@example.com');
  process.exit(1);
}

promoteUserToAdmin(email);