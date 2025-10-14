const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/userModel');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

// Seed admin user
const seedAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists in the database');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const adminUser = new User({
      name: 'Administrator',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@admin.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Main seeder function
const runSeeder = async () => {
  console.log('🌱 Starting database seeding...');
  
  await connectDB();
  await seedAdminUser();
  
  console.log('🌱 Database seeding completed!');
  process.exit(0);
};

// Run seeder if this file is executed directly
if (require.main === module) {
  runSeeder();
}

module.exports = { seedAdminUser };