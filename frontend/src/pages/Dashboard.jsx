import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardNavbar from '../components/DashboardNavbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const getRoleDisplay = (role) => {
    const roleMap = {
      traveler: 'Traveler',
      guide: 'Tour Guide',
      driver: 'Driver',
      driver_guide: 'Driver Guide',
      tour_operator: 'Tour Operator',
      travel_agency: 'Travel Agency',
      accommodation: 'Accommodation',
      cook: 'Cook/Chef',
      admin: 'Admin',
      super_admin: 'Super Admin'
    };
    return roleMap[role] || role;
  };

  const getRoleMessage = (role) => {
    const messages = {
      traveler: 'Browse tours, book experiences, and manage your trips.',
      guide: 'Manage your tours, availability, and bookings.',
      driver: 'Manage your driving services and bookings.',
      driver_guide: 'Manage your driving and guiding services.',
      tour_operator: 'Manage your tour packages and operator dashboard.',
      travel_agency: 'Manage your agency and client bookings.',
      accommodation: 'Manage your property listings and reservations.',
      cook: 'Manage your culinary services and bookings.',
      admin: 'Admin panel - manage users, listings, and platform.',
      super_admin: 'Super Admin - full platform control.'
    };
    return messages[role] || 'Welcome to your dashboard!';
  };

  const handleWishlist = () => {
    alert('❤️ Wishlist feature is coming soon!');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back to Home Button */}
        <Link 
          to="/explore" 
          className="inline-flex items-center gap-2 text-[#00A651] hover:text-[#00833E] font-medium mb-6 transition"
        >
          ← Back to Explore
        </Link>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#E5E4E7]">
          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">
            👋 Welcome, {user.fullName}!
          </h2>
          <p className="text-[#6B6375]">
            {getRoleMessage(user.role)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Role</p>
            <p className="text-xl font-bold text-[#00A651] capitalize">
              {getRoleDisplay(user.role)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Email</p>
            <p className="text-xl font-bold text-[#1A1A2E]">{user.email}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Phone</p>
            <p className="text-xl font-bold text-[#1A1A2E]">{user.phone}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Status</p>
            <p className="text-xl font-bold text-green-600">
              {user.isVerified ? '✅ Verified' : '⏳ Pending'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7]">
          <h3 className="text-xl font-bold text-[#1A1A2E] mb-4">
            🎯 Quick Actions
          </h3>
          <p className="text-[#6B6375] mb-6">
            {getRoleMessage(user.role)}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* My Profile - For ALL Users */}
            <Link to="/profile" className="bg-[#8B5CF6] text-white px-6 py-3 rounded-xl hover:bg-[#7C3AED] transition font-medium text-center">
              👤 My Profile
            </Link>

            {/* Traveler Actions */}
            {user.role === 'traveler' && (
              <>
                <Link to="/explore" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium text-center">
                  🔍 Browse Tours
                </Link>
                <Link to="/my-bookings" className="bg-[#F5A623] text-white px-6 py-3 rounded-xl hover:bg-[#E0951A] transition font-medium text-center">
                  📅 My Bookings
                </Link>
                <Link to="/my-reviews" className="bg-[#8B5CF6] text-white px-6 py-3 rounded-xl hover:bg-[#7C3AED] transition font-medium text-center">
                  ⭐ My Reviews
                </Link>
                <button 
                  onClick={handleWishlist}
                  className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium"
                >
                  ❤️ Wishlist
                </button>
              </>
            )}

            {/* Guide/Driver/Operator Actions */}
            {(user.role === 'guide' || user.role === 'driver' || user.role === 'driver_guide' || user.role === 'tour_operator' || user.role === 'accommodation') && (
              <>
                <Link to="/create-listing" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium text-center">
                  ➕ Create New Listing
                </Link>
                <Link to="/my-listings" className="bg-[#F5A623] text-white px-6 py-3 rounded-xl hover:bg-[#E0951A] transition font-medium text-center">
                  📋 My Listings
                </Link>
                <Link to="/my-listings-bookings" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium text-center">
                  📊 My Bookings
                </Link>
              </>
            )}

            {/* Admin Actions */}
            {(user.role === 'admin' || user.role === 'super_admin') && (
              <>
                <Link to="/admin" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium text-center">
                  👥 Manage Users
                </Link>
                <Link to="/admin" className="bg-[#F5A623] text-white px-6 py-3 rounded-xl hover:bg-[#E0951A] transition font-medium text-center">
                  📋 Manage Listings
                </Link>
                <Link to="/admin" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium text-center">
                  📊 Analytics
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[#6B6375] text-sm mt-8">
          Made with ❤️ in Ethiopia
        </div>
      </div>
    </div>
  );
};

export default Dashboard;