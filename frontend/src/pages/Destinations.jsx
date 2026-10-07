import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';

const Destinations = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const destinations = [
    { name: 'Lalibela', region: 'Amhara', icon: '⛪', desc: 'Rock-hewn churches' },
    { name: 'Simien Mountains', region: 'Amhara', icon: '🏔️', desc: 'UNESCO World Heritage' },
    { name: 'Danakil Depression', region: 'Afar', icon: '🌋', desc: 'Hottest place on Earth' },
    { name: 'Omo Valley', region: 'SNNPR', icon: '🎭', desc: 'Indigenous cultures' },
    { name: 'Gondar', region: 'Amhara', icon: '🏰', desc: 'Royal castles' },
    { name: 'Axum', region: 'Tigray', icon: '🗿', desc: 'Ancient obelisks' },
    { name: 'Harar', region: 'Harari', icon: '🕌', desc: 'Walled city' },
    { name: 'Addis Ababa', region: 'Addis Ababa', icon: '🏙️', desc: 'Capital city' },
    { name: 'Bale Mountains', region: 'Oromia', icon: '🐺', desc: 'Ethiopian wolves' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {isLoggedIn ? <DashboardNavbar /> : <Navbar />}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">🌍 Destinations</h1>
        <p className="text-[#6B6375] mb-8">Explore Ethiopia's most iconic destinations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, i) => (
            <Link
              key={i}
              to={`/explore?destination=${encodeURIComponent(dest.name)}`}
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7] hover:shadow-xl transition hover:border-[#00A651]"
            >
              <div className="text-5xl mb-3">{dest.icon}</div>
              <h3 className="font-bold text-[#1A1A2E] text-lg">{dest.name}</h3>
              <p className="text-sm text-[#6B6375]">📍 {dest.region}</p>
              <p className="text-sm text-[#6B6375] mt-1">{dest.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;