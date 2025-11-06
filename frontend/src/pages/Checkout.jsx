import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/client';
import { CartContext } from '../context/CartContext';
import './Checkout.scss';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
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

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        products: cart,
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
        totalPrice: getCartTotal(),
      };

      const { data } = await API.post('/orders', orderData);
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="checkout-form">
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
              />
            </div>

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="summary-item">
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
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{getCartTotal().toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;