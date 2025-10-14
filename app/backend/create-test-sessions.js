// Script to create test sessions data
require('dotenv').config();
const mongoose = require('mongoose');
const Session = require('./models/sessionModel');
const User = require('./models/userModel');

async function createTestSessions() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get some users for testing
    const users = await User.find({}).limit(3);
    
    if (users.length === 0) {
      console.log('No users found. Please create some users first.');
      process.exit(1);
    }

    // Sample session data
    const testSessions = [
      {
        client: users[0]._id,
        sessionType: 'Wedding',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: 'Scheduled',
        price: 2500,
        location: {
          address: '123 Wedding Venue St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        notes: 'Outdoor wedding ceremony and reception. Need drone shots.'
      },
      {
        client: users[1]._id,
        sessionType: 'Portrait',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        status: 'Scheduled',
        price: 350,
        location: {
          address: '456 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        notes: 'Professional headshots for LinkedIn profile.'
      },
      {
        client: users[2] ? users[2]._id : users[0]._id,
        sessionType: 'Family',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'Scheduled',
        price: 500,
        location: {
          address: '789 Beach Blvd',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101'
        },
        notes: 'Beach family photos during golden hour.'
      },
      {
        client: users[0]._id,
        sessionType: 'Event',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        status: 'Completed',
        price: 1200,
        location: {
          address: '321 Conference Center',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        notes: 'Corporate conference and networking event photography.'
      },
      {
        client: users[1]._id,
        sessionType: 'Commercial',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        status: 'In Progress',
        price: 1800,
        location: {
          address: '555 Studio Complex',
          city: 'Atlanta',
          state: 'GA',
          zipCode: '30301'
        },
        notes: 'Product photography for new fashion line.'
      }
    ];

    // Clear existing test sessions
    await Session.deleteMany({});
    console.log('Cleared existing sessions');

    // Create new test sessions
    const createdSessions = await Session.insertMany(testSessions);
    console.log(`✅ Created ${createdSessions.length} test sessions:`);
    
    createdSessions.forEach((session, index) => {
      console.log(`${index + 1}. ${session.sessionType} session for ${session.client}`);
      console.log(`   Date: ${session.date.toLocaleDateString()}`);
      console.log(`   Status: ${session.status}`);
      console.log(`   Price: $${session.price}`);
      console.log(`   Location: ${session.location.city}, ${session.location.state}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test sessions:', error);
    process.exit(1);
  }
}

createTestSessions();