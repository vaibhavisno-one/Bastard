import React, { useState } from 'react';
import './LegalPages.scss';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');

    const handleTrack = (e) => {
        e.preventDefault();
        // In a real app, this would verify the order ID or redirect to details
        alert(`Tracking functionality for Order ID: ${orderId} will be implemented soon.`);
    };

    return (
        <div className="legal-page">
            <div className="container">
                <h1>Track Your Order</h1>
                <div className="content">
                    <p>Enter your Order ID below to check the status of your shipment.</p>

                    <div className="contact-form-placeholder" style={{ marginTop: '2rem', maxWidth: '500px' }}>
                        <form onSubmit={handleTrack}>
                            <div className="form-group">
                                <label>Order ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g., ORD-123456"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    required
                                />
                            </div>
                            <button className="submit-btn">Track Order</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
