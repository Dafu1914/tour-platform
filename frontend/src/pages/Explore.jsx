import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';

const Explore = () => {
  const isLoggedIn = !!localStorage.getItem('token');
  const [searchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState(searchParams.get('destination') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/listings');
        if (response.data.success) {
          setListings(response.data.data);
          setFilteredListings(response.data.data);
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

  useEffect(() => {
    let results = [...listings];

    if (searchTerm) {
      results = results.filter(listing =>
        listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      results = results.filter(listing => listing.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredListings(results);
  }, [searchTerm, selectedCategory, sortBy, listings]);

  const getCategoryIcon = (category) => {
    const icons = {
      tour: '🏔️',
      accommodation: '🏨',
      transport: '🚗',
      experience: '🎭',
    };
    return icons[category] || '🌟';
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {isLoggedIn ? <DashboardNavbar /> : <Navbar />}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">🔍 Explore Experiences</h1>
        <p className="text-[#6B6375] mb-6">Discover amazing tours and experiences in Ethiopia</p>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="select-field"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="tour">Tours</option>
              <option value="accommodation">Accommodation</option>
              <option value="transport">Transport</option>
              <option value="experience">Experiences</option>
            </select>
            <select
              className="select-field"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-[#6B6375]">⏳ Loading experiences...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#E5E4E7]">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">No Experiences Found</h3>
            <p className="text-[#6B6375] mb-6">Try adjusting your search filters.</p>
            <button
              onClick={handleReset}
              className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-[#6B6375] mb-4">
              Showing {filteredListings.length} of {listings.length} experiences
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Link
                  key={listing._id}
                  to={`/listing/${listing._id}`}
                  className="block bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] hover:shadow-xl transition hover:border-[#00A651]"
                >
                  <div className="text-5xl mb-4">{getCategoryIcon(listing.category)}</div>
                  <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">{listing.title}</h3>
                  <p className="text-[#6B6375] text-sm mb-1">
                    📍 {listing.destination}, {listing.region}
                  </p>
                  <p className="text-[#6B6375] text-sm mb-2">
                    ⏱️ {listing.duration} {listing.durationUnit}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-[#00A651] font-bold">
                      From {listing.currency || 'ETB'} {listing.price}
                    </p>
                    <span className="text-sm text-[#6B6375]">
                      ⭐ {listing.rating || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;