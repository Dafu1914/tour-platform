import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 hero-gradient">
      <div className="max-w-md w-full card">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00A651]">🚀 Tour Platform</h1>
          <p className="text-[#6B6375] mt-1">Discover Ethiopia. Authentic. Local.</p>
        </div>

        <h2 className="text-2xl font-bold text-center text-[#1A1A2E]">Create Account</h2>
        <p className="text-center text-[#6B6375] mb-6">Join Ethiopia's trusted travel marketplace</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label className="label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="label">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <label className="label">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="input-field"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div className="mb-4">
            <label className="label">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Confirm your password"
            />
          </div>

          <div className="mb-6">
            <label className="label">I am a *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="select-field"
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
            className="btn-primary w-full"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[#6B6375] mt-6">
          Already have an account?{' '}
          <a href="/login" className="link">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;