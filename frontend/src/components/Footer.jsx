import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-gradient text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Twsta</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Discover Ethiopia. Authentic. Local. Unforgettable.
            </p>
            <p className="text-sm text-white/60">
              🇪🇹 Made in Ethiopia
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/explore" className="hover:text-white transition">All Tours</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition">Destinations</Link></li>
              <li><Link to="/guides" className="hover:text-white transition">Guides</Link></li>
              <li><Link to="/experiences" className="hover:text-white transition">Experiences</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/stores" className="hover:text-white transition">Stores</Link></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>📧 hello@twsta.et</li>
              <li>📱 +251 912 345 678</li>
              <li>📍 Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
          <p>© {currentYear} Twsta Ethiopia Tours. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;