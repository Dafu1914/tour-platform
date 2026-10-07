import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    guests: 1,
    date: '',
    specialRequests: '',
  });

  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/listings/${id}`);
        if (response.data.success) {
          setListing(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleBookingChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert('Please login to book this experience');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        {
          listingId: listing._id,
          guests: parseInt(bookingData.guests),
          bookingDate: bookingData.date,
          specialRequests: bookingData.specialRequests,
          contactEmail: user.email || '',
          contactPhone: user.phone || '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert('✅ Booking created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  // Get icon based on category
  const getCategoryIcon = (category) => {
    const icons = {
      tour: '🏔️',
      accommodation: '🏨',
      transport: '🚗',
      experience: '🎭',
    };
    return icons[category] || '🌟';
  };

  if (loading && !listing) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">⏳ Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-red-500">{error || 'Listing not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link to="/" className="text-[#00A651] hover:text-[#00833E] inline-block mb-6">
          ← Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-[#E5E4E7]">
              <div className="text-8xl text-center mb-4">{getCategoryIcon(listing.category)}</div>
              <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">{listing.title}</h1>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="badge badge-primary">{listing.category}</span>
                <span className="badge bg-green-100 text-green-600">✅ Active</span>
                <span className="badge bg-blue-100 text-blue-600">⭐ {listing.rating || 0} stars</span>
              </div>
              <p className="text-[#6B6375] mb-4">
                📍 {listing.destination}, {listing.region}
              </p>
              <p className="text-[#1A1A2E] leading-relaxed">{listing.description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-[#E5E4E7]">
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-4">📋 Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-[#6B6375]">Duration</p>
                  <p className="font-semibold text-[#1A1A2E]">{listing.duration} {listing.durationUnit}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6375]">Max Guests</p>
                  <p className="font-semibold text-[#1A1A2E]">{listing.maxGuests} people</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6375]">Price</p>
                  <p className="font-semibold text-[#00A651]">{listing.currency || 'ETB'} {listing.price} / {listing.pricePer}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6375]">Booking Type</p>
                  <p className="font-semibold text-[#1A1A2E] capitalize">{listing.bookingType}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6375]">Cancellation</p>
                  <p className="font-semibold text-[#1A1A2E] capitalize">{listing.cancellationPolicy}</p>
                </div>
                <div>
                  <p className="text-sm text-[#6B6375]">Views</p>
                  <p className="font-semibold text-[#1A1A2E]">{listing.views || 0}</p>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listing.inclusions && listing.inclusions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
                  <h4 className="font-bold text-[#1A1A2E] mb-3">✅ Inclusions</h4>
                  <ul className="space-y-2">
                    {listing.inclusions.map((item, idx) => (
                      <li key={idx} className="text-[#6B6375]">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {listing.exclusions && listing.exclusions.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]">
                  <h4 className="font-bold text-[#1A1A2E] mb-3">❌ Exclusions</h4>
                  <ul className="space-y-2">
                    {listing.exclusions.map((item, idx) => (
                      <li key={idx} className="text-[#6B6375]">• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] sticky top-24">
              <h3 className="text-2xl font-bold text-[#00A651] mb-2">
                {listing.currency || 'ETB'} {listing.price}
              </h3>
              <p className="text-[#6B6375] text-sm mb-4">/ {listing.pricePer}</p>

              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={bookingData.guests}
                    onChange={handleBookingChange}
                    min="1"
                    max={listing.maxGuests}
                    className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                  />
                  <p className="text-xs text-[#6B6375] mt-1">Max {listing.maxGuests} guests</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Select Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    required
                    className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Special Requests</label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleBookingChange}
                    rows="2"
                    className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                    placeholder="Any special requests?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#00A651] text-white w-full py-3 rounded-xl hover:bg-[#00833E] transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Processing...' : (isLoggedIn ? 'Book Now' : 'Login to Book')}
                </button>
              </form>

              {/* Provider Info */}
              <div className="mt-6 pt-6 border-t border-[#E5E4E7]">
                <p className="text-sm text-[#6B6375] mb-2">Provided by</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00A651] rounded-full flex items-center justify-center text-white font-bold">
                    {listing.user?.fullName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">{listing.user?.fullName || 'Unknown'}</p>
                    <p className="text-xs text-[#6B6375] capitalize">{listing.user?.role?.replace('_', ' ') || 'Provider'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;