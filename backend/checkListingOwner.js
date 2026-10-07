const mongoose = require('mongoose');
require('dotenv').config();

async function checkListingOwner() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const listingsCollection = db.collection('listings');
    const bookingsCollection = db.collection('bookings');
    const usersCollection = db.collection('users');

    // Get all users
    const users = await usersCollection.find().toArray();
    console.log('\n👥 ALL USERS:');
    users.forEach(u => {
      console.log(`  - ${u.fullName} | ${u.email} | Role: ${u.role} | ID: ${u._id}`);
    });

    // Get all listings
    const listings = await listingsCollection.find().toArray();
    console.log('\n📋 ALL LISTINGS:');
    listings.forEach(l => {
      console.log(`  - ${l.title}`);
      console.log(`    Status: ${l.status}`);
      console.log(`    Owner (user): ${l.user}`);
    });

    // Get all bookings
    const bookings = await bookingsCollection.find().toArray();
    console.log('\n📅 ALL BOOKINGS:');
    bookings.forEach(b => {
      console.log(`  - Booking ID: ${b._id}`);
      console.log(`    Listing: ${b.listing}`);
      console.log(`    Traveler: ${b.traveler}`);
      console.log(`    Supplier: ${b.supplier}`);
      console.log(`    Status: ${b.status}`);
    });

    // Match analysis
    console.log('\n🔍 MATCH ANALYSIS:');
    for (const booking of bookings) {
      const listing = await listingsCollection.findOne({ _id: booking.listing });
      const supplier = await usersCollection.findOne({ _id: booking.supplier });
      const listingOwner = listing ? await usersCollection.findOne({ _id: listing.user }) : null;
      
      console.log(`\nBooking for: ${listing?.title || 'Unknown'}`);
      console.log(`  Booking.supplier ID: ${booking.supplier}`);
      console.log(`  Booking.supplier name: ${supplier?.fullName || 'NOT FOUND'}`);
      console.log(`  Listing.user (owner) ID: ${listing?.user}`);
      console.log(`  Listing.user name: ${listingOwner?.fullName || 'NOT FOUND'}`);
      console.log(`  ✅ MATCH: ${booking.supplier?.toString() === listing?.user?.toString() ? 'YES' : 'NO'}`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkListingOwner();