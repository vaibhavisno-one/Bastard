import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { CartContext } from '../context/CartContext';
import Loading from '../components/Loading';
import './PaymentCallback.scss';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderDetails, setOrderDetails] = useState(null);
  const processingRef = useRef(false); // Prevent double processing

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    
    if (!orderId) {
      setStatus('error');
      setMessage('Invalid payment session');
      cleanupPaymentData();
      return;
    }

    // Prevent double execution
    if (processingRef.current) {
      return;
    }
    processingRef.current = true;

    verifyAndCreateOrder(orderId);
  }, [searchParams]);

  const cleanupPaymentData = () => {
    sessionStorage.removeItem('pendingOrder');
    sessionStorage.removeItem('paymentProcessing');
    sessionStorage.removeItem('cashfreeOrderId');
  };

  const verifyAndCreateOrder = async (cashfreeOrderId) => {
    try {
      // Step 1: Verify payment with Cashfree
      setMessage('Verifying payment status...');
      
      const { data: verifyData } = await API.post('/payments/verify', { 
        orderId: cashfreeOrderId 
      });

      console.log('Payment Verification:', verifyData);

      // Check if payment was actually successful
      if (!verifyData.verified || !verifyData.payment) {
        setStatus('failed');
        setMessage('Payment was not completed successfully.');
        toast.error('Payment verification failed');
        cleanupPaymentData();
        return;
      }

      // Step 2: Retrieve pending order data
      setMessage('Processing your order...');
      
      const pendingOrderData = sessionStorage.getItem('pendingOrder');
      
      if (!pendingOrderData) {
        setStatus('error');
        setMessage('Order information not found. Please contact support with your payment ID.');
        toast.error('Order data missing - Payment ID: ' + cashfreeOrderId);
        cleanupPaymentData();
        return;
      }

      const orderData = JSON.parse(pendingOrderData);

      // Validate order data age (not older than 1 hour)
      const orderAge = Date.now() - (orderData.timestamp || 0);
      const ONE_HOUR = 60 * 60 * 1000;
      
      if (orderAge > ONE_HOUR) {
        setStatus('error');
        setMessage('Order session expired. Please place a new order.');
        toast.error('Order session expired');
        cleanupPaymentData();
        return;
      }

      // Step 3: Create order in database with payment info
      setMessage('Finalizing your order...');
      
      const completeOrderData = {
        products: orderData.products,
        customerInfo: orderData.customerInfo,
        totalPrice: orderData.totalPrice,
        paymentInfo: {
          cashfreeOrderId: cashfreeOrderId,
          paymentId: verifyData.payment.cf_payment_id || verifyData.payment.payment_id || cashfreeOrderId,
          paymentStatus: 'Success',
          paymentMethod: verifyData.payment.payment_method || 'Online',
          paidAt: new Date(),
        },
      };

      const { data: orderResponse } = await API.post('/orders', completeOrderData);

      console.log('Order Created:', orderResponse);

      if (!orderResponse.success || !orderResponse.order) {
        throw new Error('Order creation failed');
      }

      // Step 4: Clear cart and cleanup
      clearCart();
      cleanupPaymentData();

      // Step 5: Show success
      setOrderDetails(orderResponse.order);
      setStatus('success');
      setMessage('Payment successful! Your order has been placed.');
      toast.success('Order placed successfully! 🎉');
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (error) {
      console.error('Payment/Order Error:', error);
      
      // Determine error type and show appropriate message
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || '';
        
        if (errorMsg.includes('stock')) {
          setStatus('error');
          setMessage('Some items are out of stock. Your payment will be refunded within 5-7 business days.');
          toast.error('Out of stock - Refund will be processed');
        } else if (errorMsg.includes('Payment verification required')) {
          setStatus('failed');
          setMessage('Payment verification failed. If money was deducted, please contact support.');
          toast.error('Payment verification failed');
        } else {
          setStatus('error');
          setMessage(errorMsg);
          toast.error(errorMsg);
        }
      } else if (error.response?.status === 401) {
        setStatus('error');
        setMessage('Session expired. Please login and try again.');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatus('error');
        setMessage('An error occurred while processing your order. If payment was deducted, please contact support with payment ID: ' + cashfreeOrderId);
        toast.error('Order processing failed');
      }
      
      cleanupPaymentData();
    }
  };

  // Handle browser back button during processing
  useEffect(() => {
    const handlePopState = (e) => {
      if (status === 'processing') {
        e.preventDefault();
        const confirmLeave = window.confirm(
          'Payment is being processed. Are you sure you want to leave?'
        );
        if (!confirmLeave) {
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [status]);

  return (
    <div className="payment-callback">
      <div className="container">
        <div className="callback-card">
          {status === 'processing' && (
            <>
              <Loading />
              <h2>{message}</h2>
              <p>Please wait while we confirm your payment...</p>
              <p className="warning-text">⚠️ Do not close this page or press back button</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="success-icon">✓</div>
              <h2>{message}</h2>
              {orderDetails && (
                <div className="order-info">
                  <p>Order ID: <strong>#{orderDetails._id.slice(-6)}</strong></p>
                  <p>Amount: <strong>₹{orderDetails.totalPrice.toLocaleString('en-IN')}</strong></p>
                </div>
              )}
              <p>Thank you for your purchase!</p>
              <p className="redirect-info">Redirecting to your orders in 3 seconds...</p>
              <button 
                onClick={() => navigate('/orders')} 
                className="view-orders-btn"
              >
                View Orders Now
              </button>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="error-icon">✕</div>
              <h2>Payment Failed</h2>
              <p>{message}</p>
              <div className="error-actions">
                <button onClick={() => navigate('/cart')} className="retry-btn">
                  Return to Cart
                </button>
                <button onClick={() => navigate('/')} className="home-btn">
                  Go to Home
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="error-icon">⚠️</div>
              <h2>Order Processing Error</h2>
              <p>{message}</p>
              <div className="support-info">
                <p>If you need assistance, please contact our support team with your payment details.</p>
              </div>
              <div className="error-actions">
                <button onClick={() => navigate('/orders')} className="orders-btn">
                  View My Orders
                </button>
                <button onClick={() => navigate('/')} className="home-btn">
                  Go to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;