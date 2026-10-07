import React, { useState } from 'react';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'traveler',
  });

  const roles = [
    { value: 'traveler', label: 'Traveler' },
    { value: 'guide', label: 'Tour Guide' },
    { value: 'driver', label: 'Driver' },
    { value: 'driver_guide', label: 'Driver Guide' },
    { value: 'tour_operator', label: 'Tour Operator' },
    { value: 'travel_agency', label: 'Travel Agency' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'cook', label: 'Cook/Chef' },
  ];

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('✅ Login successful!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        role: registerData.role,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setSuccess('✅ Registration successful!');
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ✕
        </button>

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#00A651]">🚀 Twsta</h1>
          <p className="text-[#6B6375] text-sm">Discover Ethiopia. Authentic. Local.</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              mode === 'login'
                ? 'bg-[#00A651] text-white'
                : 'text-[#6B6375] hover:text-[#1A1A2E]'
            }`}
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 rounded-lg font-semibold transition ${
              mode === 'register'
                ? 'bg-[#00A651] text-white'
                : 'text-[#6B6375] hover:text-[#1A1A2E]'
            }`}
            onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
          >
            Register
          </button>
        </div>

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

        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00A651] text-white w-full py-3 rounded-xl hover:bg-[#00833E] transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={registerData.fullName}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                minLength="6"
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Minimum 6 characters"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none"
                placeholder="Confirm your password"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1">I am a</label>
              <select
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
                required
                className="w-full px-4 py-3 border border-[#E5E4E7] rounded-xl focus:border-[#00A651] focus:outline-none text-[#1A1A2E]"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00A651] text-white w-full py-3 rounded-xl hover:bg-[#00833E] transition font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="text-center text-[#6B6375] text-sm mt-4">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} className="text-[#00A651] font-semibold hover:underline">Register</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-[#00A651] font-semibold hover:underline">Sign In</button></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthModal;