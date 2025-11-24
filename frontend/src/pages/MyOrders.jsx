import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../api/client';
import Loading from '../components/Loading';
import './MyOrders.scss';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    orderId: '',
    productId: '',
    productName: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/my-orders');
      setOrders(data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await API.put(`/orders/${orderId}/cancel`);
        toast.success('Order cancelled successfully');
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const openReviewModal = (orderId, product) => {
    setReviewData({
      orderId,
      productId: product.productId._id || product.productId,
      productName: product.name,
      rating: 5,
      comment: '',
    });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(`/orders/${reviewData.orderId}/review`, {
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });

      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  if (orders.length === 0) {
    return (
      <div className="my-orders-page empty">
        <div className="container">
          <h1>My Orders</h1>
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>

        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-products">
                {order.products.map((item, index) => (
                  <div key={index} className="order-product">
                    <div className="product-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="placeholder">{item.name[0]}</div>
                      )}
                    </div>
                    <div className="product-details">
                      <h4>{item.name}</h4>
                      <p>Size: {item.size} | Qty: {item.quantity}</p>
                      <p className="price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      
                      {order.status === 'Delivered' && (
                        <button
                          className="review-btn"
                          onClick={() => openReviewModal(order._id, item)}
                        >
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total:</strong> ₹{order.totalPrice.toLocaleString('en-IN')}
                </div>
                {order.status === 'Pending' && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Write a Review</h2>
            <p className="product-name">{reviewData.productName}</p>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= reviewData.rating ? 'active' : ''}`}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Your Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  required
                  rows="4"
                  placeholder="Share your experience with this product..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;