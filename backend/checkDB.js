const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check users collection
    const db = mongoose.connection.db;
    const users = await db.collection('users').find().toArray();
    
    console.log('📋 Users in database:');
    users.forEach(user => {
      console.log(`- ${user.fullName} (${user.email}) - Role: ${user.role}`);
    });
    
    console.log(`\n📊 Total users: ${users.length}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDB();