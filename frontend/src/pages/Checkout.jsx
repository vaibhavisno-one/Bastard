import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { CartContext } from '../context/CartContext';
import Loading from '../components/Loading';
import './Checkout.scss';

const Checkout = () => {
  const { cart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    // Clear any stale order data on mount
    sessionStorage.removeItem('pendingOrder');
    sessionStorage.removeItem('paymentProcessing');

    // Load Cashfree SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (loading || sessionStorage.getItem('paymentProcessing') === 'true') {
      toast.warning('Payment is already being processed');
      return;
    }

    setLoading(true);
    sessionStorage.setItem('paymentProcessing', 'true');

    try {
      const totalAmount = getCartTotal() + 69;

      // Validate cart has items
      if (!cart || cart.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }

      // Create order data structure
      const orderData = {
        products: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
        })),
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.street,
            city: customerInfo.city,
            state: customerInfo.state,
            pincode: customerInfo.pincode,
          },
        },
        totalPrice: totalAmount,
        timestamp: Date.now(), // To track order age
      };

      // Store order data temporarily
      sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // Create payment order with Cashfree
      const { data: paymentData } = await API.post('/payments/create-order', {
        orderId: `temp_${Date.now()}`,
        amount: totalAmount,
        customerInfo: {
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: {
            street: customerInfo.street,
            city: customerInfo.city,
            state: customerInfo.state,
            pincode: customerInfo.pincode,
          },
        },
      });

      const { paymentSessionId, orderId } = paymentData;

      if (!paymentSessionId || !orderId) {
        throw new Error('Invalid payment session created');
      }

      // Store cashfree order ID
      sessionStorage.setItem('cashfreeOrderId', orderId);

      // Initialize Cashfree SDK
      const cashfree = window.Cashfree({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      });

      // Open payment modal
      const checkoutOptions = {
        paymentSessionId: paymentSessionId,
        returnUrl: `${window.location.origin}/payment/callback?order_id=${orderId}`,
      };

      const result = await cashfree.checkout(checkoutOptions);

      // Handle payment modal closure without completion
      if (result.error) {
        console.error('Payment Error:', result.error);
        toast.error(result.error.message || 'Payment failed');
        cleanupPaymentData();
        setLoading(false);
      }
      // If payment completed, redirect will happen automatically
      // If user closed modal, they stay on checkout page

    } catch (error) {
      console.error('Checkout Error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      cleanupPaymentData();
      setLoading(false);
    }
  };

  const cleanupPaymentData = () => {
    sessionStorage.removeItem('pendingOrder');
    sessionStorage.removeItem('paymentProcessing');
    sessionStorage.removeItem('cashfreeOrderId');
  };

  // Handle page visibility - detect if user returns to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // User returned to page - check if they abandoned payment
        const processing = sessionStorage.getItem('paymentProcessing');
        if (processing === 'true' && loading) {
          // Give them option to check payment status
          setLoading(false);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [loading]);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handlePayment} className="checkout-form">
            <h3>Shipping Information</h3>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={customerInfo.street}
                onChange={handleChange}
                required
                placeholder="House no, Street name"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={customerInfo.city}
                  onChange={handleChange}
                  required
                  placeholder="City"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={customerInfo.state}
                  onChange={handleChange}
                  required
                  placeholder="State"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                value={customerInfo.pincode}
                onChange={handleChange}
                required
                pattern="[0-9]{6}"
                placeholder="6-digit pincode"
                disabled={loading}
              />
            </div>

            <div className="payment-info">
              <p>💳 Secure payment powered by Cashfree</p>
              <p>✓ UPI, Cards, Net Banking & Wallets accepted</p>
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${(getCartTotal() + 69).toLocaleString('en-IN')}`}
            </button>
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item, index) => (
                <div key={`${item.productId}-${item.size}-${index}`} className="summary-item">
                  <div>
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹69</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{(getCartTotal() + 69).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;