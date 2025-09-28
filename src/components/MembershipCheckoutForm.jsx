import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:3000";

const MembershipCheckoutForm = ({ user, amount, onSuccess, onClose }) => {
//   const stripe = useStripe();
//   const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    // Block native form submission.
    event.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Create payment intent on the server
      const paymentIntentResponse = await fetch(`${API_BASE}/create-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount })
      });

      if (!paymentIntentResponse.ok) {
        const errorText = await paymentIntentResponse.text();
        throw new Error(errorText || 'Payment service unavailable');
      }

      const paymentIntentData = await paymentIntentResponse.json();
      
      console.log('Payment intent created:', paymentIntentData);

      // For mock payments, we don't need to process with Stripe
      // Just save the payment directly
      if (paymentIntentData.mock) {
        
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Save mock payment
        const paymentResponse = await fetch(`${API_BASE}/payments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.email,
            amount: amount,
            transactionId: "mock_txn_" + Date.now(),
            membershipType: 'premium'
          })
        });

        if (!paymentResponse.ok) {
          throw new Error('Failed to save payment');
        }

        const paymentResult = await paymentResponse.json();
        console.log(paymentResult);
        
        toast.success('Payment successful! Your membership has been upgraded to Premium.');
        onSuccess();
        return;
      }


    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      toast.error(`Payment failed: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Upgrade to Premium</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Payment Details */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Plan</span>
              <span className="font-semibold text-purple-600">Premium Membership</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Amount</span>
              <span className="text-2xl font-bold text-gray-900">${amount}</span>
            </div>
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details
            </label>
            <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      fontFamily: 'Inter, system-ui, sans-serif',
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter any card details
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Features Included */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <h4 className="font-semibold text-gray-900 mb-3">What you get:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited product submissions
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Featured product placement
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            {processing ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </div>
            ) : (
              `Complete Payment - $${amount}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MembershipCheckoutForm;