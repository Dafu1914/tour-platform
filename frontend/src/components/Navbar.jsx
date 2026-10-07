import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Guides', path: '/guides' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Stores', path: '/stores' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      } px-6 py-3 border-b border-[#E5E4E7]`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#00A651]">Twsta</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[#1A1A2E] hover:text-[#00A651] transition text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <>
                <button 
                  onClick={() => openAuthModal('login')}
                  className="text-[#00A651] font-semibold hover:text-[#00833E] transition text-sm"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => openAuthModal('register')}
                  className="bg-[#00A651] text-white px-5 py-2 rounded-xl hover:bg-[#00833E] transition text-sm font-medium shadow-md hover:shadow-lg"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="text-sm text-[#6B6375] hover:text-[#00A651] transition">
                  👋 {user?.fullName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button 
            className="md:hidden text-[#1A1A2E]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#E5E4E7]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-[#1A1A2E] hover:text-[#00A651] transition"
              >
                {link.name}
              </Link>
            ))}
            
            {!isLoggedIn ? (
              <div className="mt-4 flex flex-col gap-2">
                <button onClick={() => openAuthModal('login')} className="text-[#00A651] font-semibold">Sign In</button>
                <button onClick={() => openAuthModal('register')} className="bg-[#00A651] text-white text-center px-5 py-2 rounded-xl">Register</button>
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                <Link to="/dashboard" className="text-[#00A651] font-semibold">Dashboard</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl">Logout</button>
              </div>
            )}
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;