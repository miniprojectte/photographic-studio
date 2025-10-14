// Script to test the booking status update API endpoint
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Booking = require('./models/bookingModel');
const jwt = require('jsonwebtoken');

async function testBookingStatusUpdate() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found');
      process.exit(1);
    }

    console.log(`✅ Found admin user: ${adminUser.name} (${adminUser.email})`);

    // Generate JWT token for admin
    const token = jwt.sign(
      { id: adminUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log('✅ Generated JWT token for admin');

    // Find a booking to test with
    const booking = await Booking.findOne({});
    if (!booking) {
      console.log('❌ No bookings found to test with');
      
      // Create a test booking
      const testBooking = await Booking.create({
        name: 'Test Client',
        email: 'testclient@test.com',
        phone: '1234567890',
        sessionType: 'portrait',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'pending',
        message: 'Test booking for status update'
      });
      
      console.log('✅ Created test booking:', testBooking._id);
      
      // Test status update
      testBooking.status = 'confirmed';
      await testBooking.save();
      
      console.log('✅ Successfully updated booking status to confirmed');
    } else {
      console.log(`✅ Found test booking: ${booking._id} (current status: ${booking.status})`);
      
      // Test status update
      const originalStatus = booking.status;
      const newStatus = booking.status === 'pending' ? 'confirmed' : 'pending';
      
      booking.status = newStatus;
      await booking.save();
      
      console.log(`✅ Successfully updated booking status from ${originalStatus} to ${newStatus}`);
    }

    // Test the API endpoint directly
    const fetch = require('node-fetch');
    const testBooking = await Booking.findOne({});
    
    if (testBooking) {
      const response = await fetch(`http://localhost:5000/api/bookings/${testBooking._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'confirmed' })
      });

      const result = await response.json();
      console.log('API Response Status:', response.status);
      console.log('API Response:', result);
      
      if (result.success) {
        console.log('✅ API endpoint test successful');
      } else {
        console.log('❌ API endpoint test failed:', result.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testBookingStatusUpdate();