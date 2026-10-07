import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import MyBookings from './pages/MyBookings';
import MyListings from './pages/MyListings';
import MyListingsBookings from './pages/MyListingsBookings';
import Profile from './pages/Profile';
import MyReviews from './pages/MyReviews';
import AdminPanel from './pages/AdminPanel';
import PaymentSuccess from './pages/PaymentSuccess';
import Explore from './pages/Explore';
import Destinations from './pages/Destinations';
import Guides from './pages/Guides';
import Experiences from './pages/Experiences';
import Stores from './pages/Stores';
import AboutUs from './pages/AboutUs';
import WriteReview from './pages/WriteReview';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Homepage - Only for non-logged-in users */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} 
        />
        
        {/* PUBLIC Routes */}
        <Route path="/explore" element={<Explore />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
        {/* PROTECTED Routes */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
        <Route path="/create-listing" element={isAuthenticated ? <CreateListing /> : <Navigate to="/" />} />
        <Route path="/my-bookings" element={isAuthenticated ? <MyBookings /> : <Navigate to="/" />} />
        <Route path="/my-listings" element={isAuthenticated ? <MyListings /> : <Navigate to="/" />} />
        <Route path="/my-listings-bookings" element={isAuthenticated ? <MyListingsBookings /> : <Navigate to="/" />} />
        <Route path="/my-reviews" element={isAuthenticated ? <MyReviews /> : <Navigate to="/" />} />
        <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/write-review/:bookingId" element={isAuthenticated ? <WriteReview /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;