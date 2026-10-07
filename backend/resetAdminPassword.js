const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Hash new password with proper salt rounds
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    console.log('🔑 New hashed password:', hashedPassword);

    // Update admin password
    const result = await usersCollection.updateOne(
      { email: 'admin@tourplatform.com' },
      { $set: { password: hashedPassword } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin password reset successfully!');
      console.log('📧 Email: admin@tourplatform.com');
      console.log('🔑 Password: admin123');
    } else if (result.matchedCount > 0) {
      console.log('⚠️ User found but password not updated. Trying again...');
      // Force update
      await usersCollection.updateOne(
        { email: 'admin@tourplatform.com' },
        { $set: { password: hashedPassword } }
      );
      console.log('✅ Admin password force updated!');
      console.log('📧 Email: admin@tourplatform.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('❌ Admin user not found!');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetAdminPassword();