const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const axios = require('axios');

// Initialize payment with Chapa
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'chapa' } = req.body;

    // Find booking
    const booking = await Booking.findById(bookingId)
      .populate('listing', 'title')
      .populate('traveler', 'fullName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if booking belongs to user
    if (booking.traveler._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking',
      });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking already paid',
      });
    }

    // Generate unique transaction reference
    const transactionRef = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalPrice,
      currency: booking.currency || 'ETB',
      transactionRef,
      paymentMethod,
    });

    // Chapa payment initialization
    const chapaData = {
      amount: booking.totalPrice,
      currency: booking.currency || 'ETB',
      email: req.user.email,
      first_name: req.user.fullName,
      phone_number: req.user.phone,
      tx_ref: transactionRef,
      callback_url: process.env.CHAPA_CALLBACK_URL,
      return_url: process.env.CHAPA_RETURN_URL,
      customization: {
        title: `Booking: ${booking.listing.title}`,
        description: `Payment for ${booking.listing.title}`,
      },
    };

    // Make request to Chapa API
    const chapaResponse = await axios.post(
      `${process.env.CHAPA_BASE_URL}/transaction/initialize`,
      chapaData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (chapaResponse.data.status === 'success') {
      // Update payment with Chapa response
      payment.chapaResponse = chapaResponse.data;
      payment.status = 'processing';
      await payment.save();

      // Update booking payment status
      booking.paymentStatus = 'pending';
      await booking.save();

      res.status(200).json({
        success: true,
        data: {
          paymentUrl: chapaResponse.data.data.checkout_url,
          transactionRef,
          paymentId: payment._id,
        },
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      
      res.status(400).json({
        success: false,
        message: 'Payment initialization failed',
        error: chapaResponse.data.message,
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Chapa webhook callback
exports.chapaCallback = async (req, res) => {
  try {
    const { tx_ref, status } = req.body;

    // Find payment
    const payment = await Payment.findOne({ transactionRef: tx_ref });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // Update payment status
    if (status === 'success') {
      payment.status = 'completed';
      
      // Update booking
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: 'paid',
        status: 'confirmed',
      });
    } else {
      payment.status = 'failed';
    }

    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Callback processed successfully',
    });
  } catch (error) {
    console.error('Chapa callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Verify payment status
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionRef } = req.params;

    const payment = await Payment.findOne({ transactionRef })
      .populate('booking', 'title totalPrice')
      .populate('user', 'fullName email');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// Get payment status for a booking
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ booking: bookingId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this booking',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        transactionRef: payment.transactionRef,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};