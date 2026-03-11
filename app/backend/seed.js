// Seed script to populate database with initial data
// Run with: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Booking = require('./models/bookingModel');
const Message = require('./models/messageModel');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@mnstudio.com' });

    let admin;
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      admin = existingAdmin;
    } else {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      admin = await User.create({
        name: 'Admin User',
        email: 'admin@mnstudio.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Admin user created: admin@mnstudio.com / admin123');
    }

    // Check if demo user exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });

    let demoUser;
    if (existingUser) {
      console.log('ℹ️  Demo user already exists');
      demoUser = existingUser;
    } else {
      // Create demo user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('demo123', salt);

      demoUser = await User.create({
        name: 'Demo User',
        email: 'demo@example.com',
        password: hashedPassword,
        role: 'user'
      });
      console.log('✅ Demo user created: demo@example.com / demo123');
    }

    // Create sample bookings if none exist
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      const futureDate1 = new Date();
      futureDate1.setDate(futureDate1.getDate() + 7);

      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 14);

      const futureDate3 = new Date();
      futureDate3.setDate(futureDate3.getDate() + 21);

      await Booking.insertMany([
        {
          user: demoUser._id,
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+1 555-123-4567',
          sessionType: 'portrait',
          date: futureDate1,
          message: 'Looking forward to my portrait session!',
          status: 'confirmed'
        },
        {
          user: demoUser._id,
          name: 'Demo User',
          email: 'demo@example.com',
          phone: '+1 555-123-4567',
          sessionType: 'family',
          date: futureDate2,
          message: 'Family photoshoot for 4 people',
          status: 'pending'
        },
        {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1 555-987-6543',
          sessionType: 'wedding',
          date: futureDate3,
          message: 'Wedding photography for approx 100 guests',
          status: 'pending'
        }
      ]);
      console.log('✅ Sample bookings created');
    } else {
      console.log(`ℹ️  ${bookingCount} bookings already exist`);
    }

    // Create welcome message if none exist
    const messageCount = await Message.countDocuments();
    if (messageCount === 0) {
      await Message.create({
        sender: admin._id,
        recipient: demoUser._id,
        subject: 'Welcome to MN Studio!',
        body: 'Thank you for joining MN Studio! We\'re excited to capture your special moments. Feel free to reach out if you have any questions about our services.',
        threadId: `${demoUser._id}-${admin._id}`
      });
      console.log('✅ Welcome message created');
    } else {
      console.log(`ℹ️  ${messageCount} messages already exist`);
    }

    console.log('\n🎉 Database seeding complete!\n');
    console.log('📋 Login Credentials:');
    console.log('   Admin: admin@mnstudio.com / admin123');
    console.log('   User:  demo@example.com / demo123');
    console.log('\n💡 You can now view this data in MongoDB Compass');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();