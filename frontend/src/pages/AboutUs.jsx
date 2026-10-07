import React from 'react';
import Navbar from '../components/Navbar';
import DashboardNavbar from '../components/DashboardNavbar';

const AboutUs = () => {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {isLoggedIn ? <DashboardNavbar /> : <Navbar />}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#1A1A2E] mb-4 text-center">
          About Twsta
        </h1>
        <p className="text-xl text-[#6B6375] text-center mb-12">
          Discover Ethiopia. Authentic. Local. Unforgettable.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#E5E4E7]">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">🎯 Our Mission</h2>
          <p className="text-[#6B6375] leading-relaxed">
            To connect travelers with authentic Ethiopian experiences while empowering
            local guides, drivers, tour operators, and businesses through a trusted
            digital marketplace. We believe in sustainable tourism that benefits
            local communities and preserves Ethiopia's rich cultural heritage.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#E5E4E7]">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">💡 Why We Exist</h2>
          <ul className="space-y-3 text-[#6B6375]">
            <li>✅ <strong>Trusted Connections</strong> — Every supplier is verified for your safety.</li>
            <li>✅ <strong>Local Empowerment</strong> — We help Ethiopian tour professionals grow.</li>
            <li>✅ <strong>Authentic Experiences</strong> — Real culture, real people, real Ethiopia.</li>
            <li>✅ <strong>Secure Bookings</strong> — Safe payments through Chapa & Telebirr.</li>
            <li>✅ <strong>24/7 Support</strong> — Local team ready to help anytime.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#E5E4E7]">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">🌟 Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="font-bold text-[#1A1A2E]">Trust</h3>
              <p className="text-sm text-[#6B6375]">Verified suppliers, secure transactions</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="font-bold text-[#1A1A2E]">Authenticity</h3>
              <p className="text-sm text-[#6B6375]">Real local experiences</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">💚</div>
              <h3 className="font-bold text-[#1A1A2E]">Sustainability</h3>
              <p className="text-sm text-[#6B6375]">Supporting local communities</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7]">
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">📞 Contact Us</h2>
          <div className="space-y-2 text-[#6B6375]">
            <p>📧 Email: <a href="mailto:hello@twsta.et" className="text-[#00A651] hover:underline">hello@twsta.et</a></p>
            <p>📱 Phone: +251 912 345 678</p>
            <p>📍 Address: Addis Ababa, Ethiopia</p>
          </div>
          <p className="text-center text-sm text-[#6B6375] mt-8">
            Made with 🇪🇹 in Ethiopia
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;