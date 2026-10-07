import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tour',
    destination: '',
    region: '',
    price: '',
    pricePer: 'person',
    duration: '',
    durationUnit: 'days',
    maxGuests: '',
    inclusions: '',
    exclusions: '',
    amenities: '',
    bookingType: 'request',
    cancellationPolicy: 'moderate',
  });

  const categories = [
    { value: 'tour', label: 'Tour' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'transport', label: 'Transport' },
    { value: 'experience', label: 'Experience' },
  ];

  const regions = [
    'Addis Ababa',
    'Amhara',
    'Oromia',
    'Tigray',
    'SNNPR',
    'Somali',
    'Benishangul-Gumuz',
    'Gambela',
    'Harari',
    'Dire Dawa',
    'Afar',
  ];

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
      
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      // Prepare data
      const listingData = {
        ...formData,
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        inclusions: formData.inclusions.split(',').map(item => item.trim()).filter(Boolean),
        exclusions: formData.exclusions.split(',').map(item => item.trim()).filter(Boolean),
        amenities: formData.amenities.split(',').map(item => item.trim()).filter(Boolean),
      };

      const response = await axios.post(
        'http://localhost:5000/api/listings',
        listingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess('✅ Listing created successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7]">
          <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">
            📋 Create New Listing
          </h2>
          <p className="text-[#6B6375] mb-6">
            List your tour, accommodation, or service
          </p>

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
            {/* Title */}
            <div className="mb-4">
              <label className="label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., 3-Day Simien Mountains Trek"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="input-field"
                placeholder="Describe your tour or service..."
              />
            </div>

            {/* Category & Region */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="select-field"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Region *</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="select-field"
                >
                  <option value="">Select region</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Destination */}
            <div className="mb-4">
              <label className="label">Destination / City *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Gondar, Lalibela, Addis Ababa"
              />
            </div>

            {/* Price & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Price (ETB) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                  placeholder="e.g., 8500"
                />
              </div>
              <div>
                <label className="label">Price Per</label>
                <select
                  name="pricePer"
                  value={formData.pricePer}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="person">Per Person</option>
                  <option value="group">Per Group</option>
                  <option value="room">Per Room</option>
                  <option value="night">Per Night</option>
                </select>
              </div>
            </div>

            {/* Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Duration *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="label">Duration Unit</label>
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="nights">Nights</option>
                </select>
              </div>
            </div>

            {/* Max Guests */}
            <div className="mb-4">
              <label className="label">Maximum Guests *</label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
                placeholder="e.g., 10"
              />
            </div>

            {/* Inclusions, Exclusions, Amenities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="label">Inclusions</label>
                <input
                  type="text"
                  name="inclusions"
                  value={formData.inclusions}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Guide, Meals, Transport"
                />
                <p className="text-xs text-[#6B6375] mt-1">Comma separated</p>
              </div>
              <div>
                <label className="label">Exclusions</label>
                <input
                  type="text"
                  name="exclusions"
                  value={formData.exclusions}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Flights, Insurance"
                />
                <p className="text-xs text-[#6B6375] mt-1">Comma separated</p>
              </div>
              <div>
                <label className="label">Amenities</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="WiFi, Parking, Pool"
                />
                <p className="text-xs text-[#6B6375] mt-1">Comma separated</p>
              </div>
            </div>

            {/* Booking Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label">Booking Type</label>
                <select
                  name="bookingType"
                  value={formData.bookingType}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="request">Request (Manual Approval)</option>
                  <option value="instant">Instant Booking</option>
                </select>
              </div>
              <div>
                <label className="label">Cancellation Policy</label>
                <select
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleChange}
                  className="select-field"
                >
                  <option value="flexible">Flexible</option>
                  <option value="moderate">Moderate</option>
                  <option value="strict">Strict</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;