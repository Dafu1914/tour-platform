import React from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';

const Experiences = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {isLoggedIn ? <DashboardNavbar /> : <Navbar />}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">🎭 Experiences</h1>
        <p className="text-[#6B6375] mb-8">Curated experiences you won't forget</p>

        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-[#E5E4E7]">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Experiences Coming Soon</h3>
          <p className="text-[#6B6375]">We're curating amazing experiences. Check back soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Experiences;