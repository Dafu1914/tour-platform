import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const WriteReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/bookings/${bookingId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setBooking(response.data.data);
        }
      } catch (err) {
        setError('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          bookingId,
          rating: parseInt(rating),
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('✅ Review submitted successfully!');
        navigate('/my-reviews');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
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

  if (error && !booking) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-[#E5E4E7]">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
            <button onClick={() => navigate('/my-bookings')} className="bg-[#00A651] text-white px-6 py-3 rounded-xl">
              Back to Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7]">
          <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">✍️ Write a Review</h1>
          <p className="text-[#6B6375] mb-6">
            Share your experience with <strong>{booking?.listing?.title}</strong>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Star Rating */}
            <div className="mb-6">
              <label className="label">Your Rating</label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-4xl transition-transform hover:scale-125"
                  >
                    {star <= rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-sm text-[#6B6375] mt-2">{rating}.0 / 5.0</p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="label">Your Review</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="5"
                required
                minLength="5"
                className="input-field"
                placeholder="Tell us about your experience..."
              />
              <p className="text-xs text-[#6B6375] mt-1">
                {comment.length} characters (min 5)
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || comment.length < 5}
                className="flex-1 bg-[#00A651] text-white py-3 rounded-xl hover:bg-[#00833E] transition font-semibold disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-bookings')}
                className="px-6 py-3 rounded-xl bg-gray-500 text-white hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;