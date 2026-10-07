import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DashboardNavbar from '../components/DashboardNavbar';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const transactionRef = searchParams.get('transaction_ref');
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionRef) {
        setError('No transaction reference found');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/payments/verify/${transactionRef}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setPayment(response.data.data);
        }
      } catch (err) {
        setError('Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [transactionRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <DashboardNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-2xl text-[#6B6375]">⏳ Verifying payment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <DashboardNavbar />

      <div className="max-w-2xl mx-auto px-6 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#E5E4E7] text-center">
          {error ? (
            <>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
              <p className="text-[#6B6375] mb-6">{error}</p>
              <Link
                to="/dashboard"
                className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition"
              >
                Go to Dashboard
              </Link>
            </>
          ) : payment && payment.status === 'completed' ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-[#00A651] mb-4">Payment Successful!</h2>
              <p className="text-[#6B6375] mb-2">
                Your booking has been confirmed.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-[#6B6375]">Transaction Reference</p>
                <p className="font-semibold text-[#1A1A2E]">{payment.transactionRef}</p>
                <p className="text-sm text-[#6B6375] mt-2">Amount</p>
                <p className="font-semibold text-[#1A1A2E]">{payment.currency} {payment.amount}</p>
                <p className="text-sm text-[#6B6375] mt-2">Status</p>
                <p className="font-semibold text-[#00A651]">{payment.status}</p>
              </div>
              <Link
                to="/my-bookings"
                className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition"
              >
                View My Bookings
              </Link>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Payment Processing</h2>
              <p className="text-[#6B6375] mb-6">
                Your payment is being processed. You'll receive a confirmation email shortly.
              </p>
              <Link
                to="/dashboard"
                className="bg-[#00A651] text-white px-6 py-3 rounded-xl hover:bg-[#00833E] transition"
              >
                Go to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;