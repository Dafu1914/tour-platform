import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  // Fetch my reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/reviews/my-reviews', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          bookingId: selectedBooking._id,
          rating: parseInt(formData.rating),
          comment: formData.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setReviews([response.data.data, ...reviews]);
        setShowReviewForm(false);
        setSelectedBooking(null);
        setFormData({ rating: 5, comment: '' });
        alert('✅ Review submitted successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">⏳ Loading your reviews...</div>
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
            <h1 className="text-3xl font-bold text-[#1A1A2E]">⭐ My Reviews</h1>
            <p className="text-[#6B6375]">Reviews you've written for experiences</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#E5E4E7]">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">No Reviews Yet</h3>
            <p className="text-[#6B6375] mb-6">You haven't written any reviews yet.</p>
            <Link to="/my-bookings" className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition">
              View Your Bookings
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] hover:shadow-xl transition">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{renderStars(review.rating)}</span>
                      <span className="text-sm text-[#6B6375]">
                        {review.rating}.0 / 5.0
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1A1A2E]">
                      {review.listing?.title || 'Unknown Listing'}
                    </h3>
                    <p className="text-[#6B6375] text-sm">
                      📍 {review.listing?.destination || 'N/A'}
                    </p>
                    <p className="text-[#1A1A2E] mt-3">{review.comment}</p>
                    <div className="flex gap-3 mt-3">
                      <span className={`badge ${review.status === 'approved' ? 'bg-green-100 text-green-600' : review.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                        {review.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-[#6B6375]">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.supplierResponse?.text && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-[#E5E4E7]">
                        <p className="text-sm font-semibold text-[#1A1A2E]">📌 Supplier Response:</p>
                        <p className="text-[#6B6375]">{review.supplierResponse.text}</p>
                      </div>
                    )}
                  </div>
                  <Link 
                    to={`/listing/${review.listing?._id}`}
                    className="text-[#00A651] hover:text-[#00833E] text-sm font-semibold"
                  >
                    View Listing →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;