import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch users
      const usersRes = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.data);

      // Fetch listings
      const listingsRes = await axios.get('http://localhost:5000/api/admin/listings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(listingsRes.data.data);

      // Fetch stats
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data.data);

    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => 
        u._id === userId ? { ...u, isVerified: true } : u
      ));
    } catch (err) {
      alert('Failed to verify user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleApproveListing = async (listingId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/listings/${listingId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings(listings.map(l => 
        l._id === listingId ? { ...l, status: 'active' } : l
      ));
    } catch (err) {
      alert('Failed to approve listing');
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/admin/listings/${listingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setListings(listings.filter(l => l._id !== listingId));
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-600',
      active: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">⏳ Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">🛠️ Admin Panel</h1>
        <p className="text-[#6B6375] mb-8">Manage users, listings, and platform content</p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Total Users</p>
            <p className="text-3xl font-bold text-[#00A651]">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Total Listings</p>
            <p className="text-3xl font-bold text-[#F5A623]">{stats.totalListings}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Total Bookings</p>
            <p className="text-3xl font-bold text-[#8B5CF6]">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
            <p className="text-sm text-[#6B6375]">Revenue</p>
            <p className="text-3xl font-bold text-[#00A651]">ETB {stats.totalRevenue}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'users'
                ? 'bg-[#00A651] text-white'
                : 'bg-white text-[#1A1A2E] hover:bg-gray-50 border border-[#E5E4E7]'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'listings'
                ? 'bg-[#00A651] text-white'
                : 'bg-white text-[#1A1A2E] hover:bg-gray-50 border border-[#E5E4E7]'
            }`}
          >
            📋 Listings
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'reviews'
                ? 'bg-[#00A651] text-white'
                : 'bg-white text-[#1A1A2E] hover:bg-gray-50 border border-[#E5E4E7]'
            }`}
          >
            ⭐ Reviews
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#E5E4E7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E4E7]">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 text-sm font-medium text-[#1A1A2E]">{user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-[#6B6375]">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-[#6B6375] capitalize">{user.role.replace('_', ' ')}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${user.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!user.isVerified && (
                            <button
                              onClick={() => handleVerifyUser(user._id)}
                              className="bg-[#00A651] text-white px-3 py-1 rounded-lg hover:bg-[#00833E] transition text-sm"
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl shadow-lg border border-[#E5E4E7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#6B6375]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E4E7]">
                  {listings.map((listing) => (
                    <tr key={listing._id}>
                      <td className="px-6 py-4 text-sm font-medium text-[#1A1A2E]">{listing.title}</td>
                      <td className="px-6 py-4 text-sm text-[#6B6375] capitalize">{listing.category}</td>
                      <td className="px-6 py-4 text-sm text-[#00A651] font-semibold">
                        {listing.currency || 'ETB'} {listing.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusColor(listing.status)}`}>
                          {listing.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {listing.status === 'pending' && (
                            <button
                              onClick={() => handleApproveListing(listing._id)}
                              className="bg-[#00A651] text-white px-3 py-1 rounded-lg hover:bg-[#00833E] transition text-sm"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7] text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Review Management</h3>
            <p className="text-[#6B6375] mb-6">Coming soon! Admin can moderate reviews.</p>
            <button className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition">
              View Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;