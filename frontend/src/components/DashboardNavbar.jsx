import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardNavbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-3 border-b border-[#E5E4E7]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#00A651]">Twsta</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#6B6375]">
            👋 {user?.fullName}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;