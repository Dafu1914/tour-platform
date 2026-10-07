import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImage: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      fullName: parsedUser.fullName || '',
      email: parsedUser.email || '',
      phone: parsedUser.phone || '',
      profileImage: parsedUser.profileImage || '',
    });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Update local storage
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSuccess('✅ Profile updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7]">
          <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">👤 My Profile</h1>
          <p className="text-[#6B6375] mb-6">Update your personal information</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Profile Image */}
            <div className="mb-6 flex items-center gap-6">
              <div className="w-24 h-24 bg-[#00A651] rounded-full flex items-center justify-center text-3xl text-white font-bold">
                {formData.fullName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-sm text-[#6B6375]">Profile Image</p>
                <p className="text-xs text-[#6B6375]">Coming soon: Upload photo feature</p>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Role Display (read-only) */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-[#E5E4E7]">
              <p className="text-sm text-[#6B6375]">Role</p>
              <p className="text-lg font-semibold text-[#1A1A2E] capitalize">
                {user.role?.replace('_', ' ')}
              </p>
            </div>

            {/* Status Display (read-only) */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-[#E5E4E7]">
              <p className="text-sm text-[#6B6375]">Account Status</p>
              <p className="text-lg font-semibold text-green-600">
                {user.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#00A651] text-white w-full py-3 rounded-xl hover:bg-[#00833E] transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;