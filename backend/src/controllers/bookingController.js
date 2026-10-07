const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { 
      listingId, guests, bookingDate, specialRequests,
      contactEmail, contactPhone, startTime, endTime
    } = req.body;

    // Get the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // ✅ FIX: Prevent users from booking their own listings
    if (listing.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot book your own listing' 
      });
    }

    // Check if listing is active
    if (listing.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'This listing is not available for booking' 
      });
    }

    // Check max guests
    if (guests > listing.maxGuests) {
      return res.status(400).json({ 
        success: false,
        message: `Maximum ${listing.maxGuests} guests allowed` 
      });
    }

    // Calculate total price
    const totalPrice = listing.price * guests;

    // Create booking
    const booking = await Booking.create({
      listing: listingId,
      traveler: req.user._id,
      supplier: listing.user,
      guests,
      totalPrice,
      currency: listing.currency || 'ETB',
      bookingDate: new Date(bookingDate),
      startTime: startTime || '',
      endTime: endTime || '',
      specialRequests: specialRequests || '',
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone,
      status: 'pending',
      paymentStatus: 'pending',
    });

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get traveler's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ traveler: req.user._id })
      .populate('listing', 'title category price duration coverImage destination region currency')
      .populate('supplier', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get bookings for supplier's listings
exports.getMyListingsBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ supplier: req.user._id })
      .populate('listing', 'title category price duration coverImage destination region currency')
      .populate('traveler', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error('Get listings bookings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('listing', 'title category price duration coverImage destination region currency')
      .populate('traveler', 'fullName email phone')
      .populate('supplier', 'fullName email phone');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.traveler._id.toString() !== req.user._id.toString() &&
        booking.supplier._id.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' &&
        req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this booking' 
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update booking status (supplier or admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.supplier.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' &&
        req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this booking' 
      });
    }

    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      refunded: [],
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${booking.status} to ${status}`,
      });
    }

    booking.status = status;
    await booking.save();

    if (status === 'confirmed') {
      await Listing.findByIdAndUpdate(booking.listing, {
        $inc: { bookings: 1 }
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.traveler.toString() !== req.user._id.toString() &&
        booking.supplier.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin' &&
        req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to cancel this booking' 
      });
    }

    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.status}`,
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || 'Cancelled by user';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};