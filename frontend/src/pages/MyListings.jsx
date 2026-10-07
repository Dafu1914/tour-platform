import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to view your listings');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/listings/user/my-listings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setListings(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-600',
      active: 'bg-green-100 text-green-600',
      paused: 'bg-gray-100 text-gray-600',
      rejected: 'bg-red-100 text-red-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      tour: '🏔️',
      accommodation: '🏨',
      transport: '🚗',
      experience: '🎭',
    };
    return icons[category] || '🌟';
  };

  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setListings(listings.filter(listing => listing._id !== listingId));
      alert('✅ Listing deleted successfully!');
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">⏳ Loading your listings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1A2E]">📋 My Listings</h1>
            <p className="text-[#6B6375]">Manage all your tours and services</p>
          </div>
          <Link 
            to="/create-listing" 
            className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition font-medium"
          >
            ➕ Create New
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {listings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#E5E4E7]">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">No Listings Yet</h3>
            <p className="text-[#6B6375] mb-6">You haven't created any listings yet.</p>
            <Link 
              to="/create-listing" 
              className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] hover:shadow-xl transition">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {getCategoryIcon(listing.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A2E]">
                        {listing.title}
                      </h3>
                      <p className="text-[#6B6375] text-sm">
                        📍 {listing.destination}, {listing.region}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm text-[#6B6375]">
                          ⏱️ {listing.duration} {listing.durationUnit}
                        </span>
                        <span className="text-sm text-[#6B6375]">
                          👤 Max {listing.maxGuests} guests
                        </span>
                        <span className="text-sm font-semibold text-[#00A651]">
                          {listing.currency || 'ETB'} {listing.price} / {listing.pricePer}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${getStatusColor(listing.status)}`}>
                      {listing.status.toUpperCase()}
                    </span>
                    <div className="flex gap-2 mt-2">
                      <Link 
                        to={`/listing/${listing._id}`}
                        className="text-[#00A651] hover:text-[#00833E] text-sm font-semibold"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(listing._id)}
                        className="text-red-500 hover:text-red-600 text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;