import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const MyListingsBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please login to view bookings');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/bookings/my-listings-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setBookings(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-600',
      confirmed: 'bg-blue-100 text-blue-600',
      completed: 'bg-green-100 text-green-600',
      cancelled: 'bg-red-100 text-red-600',
      refunded: 'bg-gray-100 text-gray-600',
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

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setUpdating(bookingId);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setBookings(bookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus }
            : booking
        ));
        alert(`✅ Booking ${newStatus} successfully!`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">⏳ Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">📊 My Listings Bookings</h1>
        <p className="text-[#6B6375] mb-8">View and manage bookings for your listings</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#E5E4E7]">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">No Bookings Yet</h3>
            <p className="text-[#6B6375] mb-6">You don't have any bookings on your listings yet.</p>
            <Link to="/create-listing" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition">
              Create a Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] hover:shadow-xl transition">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {getCategoryIcon(booking.listing?.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1A1A2E]">
                        {booking.listing?.title || 'Unknown Listing'}
                      </h3>
                      <p className="text-[#6B6375] text-sm">
                        📍 {booking.listing?.destination || 'N/A'}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm text-[#6B6375]">
                          👤 {booking.guests} guest{booking.guests > 1 ? 's' : ''}
                        </span>
                        <span className="text-sm text-[#6B6375]">
                          📅 {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-semibold text-[#00A651]">
                          {booking.currency || 'ETB'} {booking.totalPrice}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-[#6B6375]">
                          👤 Traveler: {booking.traveler?.fullName || 'Unknown'}
                        </p>
                        <p className="text-sm text-[#6B6375]">
                          📧 {booking.traveler?.email || 'No email'}
                        </p>
                        {booking.specialRequests && (
                          <p className="text-sm text-[#6B6375] mt-1">
                            📝 Special requests: {booking.specialRequests}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                    <span className={`badge ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {booking.paymentStatus.toUpperCase()}
                    </span>
                    
                    {/* Status Update Buttons */}
                    <div className="flex gap-2 mt-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                            disabled={updating === booking._id}
                            className="bg-[#00A651] text-white px-3 py-1 rounded-lg hover:bg-[#00833E] transition text-sm disabled:opacity-50"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            disabled={updating === booking._id}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'completed')}
                          disabled={updating === booking._id}
                          className="bg-[#00A651] text-white px-3 py-1 rounded-lg hover:bg-[#00833E] transition text-sm disabled:opacity-50"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                    
                    <Link 
                      to={`/listing/${booking.listing?._id}`}
                      className="text-[#00A651] hover:text-[#00833E] text-sm font-semibold"
                    >
                      View Listing →
                    </Link>
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

export default MyListingsBookings;