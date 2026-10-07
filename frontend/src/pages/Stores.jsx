import React from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';

const Stores = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  const stores = [
    { name: 'Ethiopian Coffee House', icon: '☕', desc: 'Authentic Ethiopian coffee & beans' },
    { name: 'Handmade Crafts', icon: '🧺', desc: 'Traditional baskets & pottery' },
    { name: 'Leather Goods', icon: '👞', desc: 'Handcrafted leather bags & shoes' },
    { name: 'Traditional Clothing', icon: '👗', desc: 'Habesha Kemis & Netela' },
    { name: 'Spices & Honey', icon: '🍯', desc: 'Ethiopian spices and wild honey' },
    { name: 'Art Gallery', icon: '🎨', desc: 'Local Ethiopian art & paintings' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {isLoggedIn ? <DashboardNavbar /> : <Navbar />}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-2">🛍️ Stores</h1>
        <p className="text-[#6B6375] mb-8">Shop authentic Ethiopian products</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg p-6 border border-[#E5E4E7]"
            >
              <div className="text-5xl mb-3">{store.icon}</div>
              <h3 className="font-bold text-[#1A1A2E] text-lg">{store.name}</h3>
              <p className="text-sm text-[#6B6375] mt-1">{store.desc}</p>
              <span className="inline-block mt-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                Coming Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stores;