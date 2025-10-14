// Script to test session management API endpoints
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const jwt = require('jsonwebtoken');

async function testSessionAPI() {
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

    // Test API endpoints
    const fetch = require('node-fetch');

    console.log('\n📊 Testing Session Stats API...');
    const statsResponse = await fetch('http://localhost:5000/api/sessions/admin/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const statsData = await statsResponse.json();
    console.log('Stats Response Status:', statsResponse.status);
    console.log('Stats Data:', JSON.stringify(statsData, null, 2));

    console.log('\n📋 Testing All Sessions API...');
    const allSessionsResponse = await fetch('http://localhost:5000/api/sessions/admin/all?limit=5', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const allSessionsData = await allSessionsResponse.json();
    console.log('All Sessions Response Status:', allSessionsResponse.status);
    console.log('Sessions Count:', allSessionsData.data?.length || 0);
    console.log('Pagination:', allSessionsData.pagination);

    if (allSessionsData.success && allSessionsData.data.length > 0) {
      console.log('\n🔄 Testing Session Status Update...');
      const testSession = allSessionsData.data[0];
      console.log(`Testing with session: ${testSession._id} (current status: ${testSession.status})`);
      
      const newStatus = testSession.status === 'Scheduled' ? 'In Progress' : 'Scheduled';
      
      const updateResponse = await fetch(`http://localhost:5000/api/sessions/admin/${testSession._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const updateData = await updateResponse.json();
      console.log('Update Response Status:', updateResponse.status);
      console.log('Update Success:', updateData.success);
      if (updateData.success) {
        console.log(`✅ Status updated from ${testSession.status} to ${updateData.data.status}`);
      } else {
        console.log('❌ Update failed:', updateData.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing session API:', error);
    process.exit(1);
  }
}

testSessionAPI();