import React from 'react';
import './LegalPages.scss';

const RefundPolicy = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Return, Refund, and Cancellation Policy</h1>
                <div className="content">
                    <p>Thank you for shopping at bastard_wears.</p>
                    <p>If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns.</p>

                    <h2>Conditions for Returns</h2>
                    <p>In order for the Goods to be eligible for a return, please make sure that:</p>
                    <ul>
                        <li>The Goods were purchased in the last 7 days</li>
                        <li>The Goods are in the original packaging</li>
                        <li>The Goods have not been used or damaged</li>
                    </ul>

                    <h2>Refunds</h2>
                    <p>We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.</p>

                    <h2>Cancellation Policy</h2>
                    <p>You can cancel your order before it has been shipped. To cancel an order, please contact us immediately at bastardwears@gmail.com with your order details.</p>

                    <h2>Shipping Policy</h2>
                    <p>We ship to addresses within India. Shipping times may vary depending on your location. Standard shipping typically takes 3-7 business days.</p>

                    <h2>Contact Us</h2>
                    <p>If you have any questions about our Returns and Refunds Policy, please contact us:</p>
                    <ul>
                        <li>By email: bastardwears@gmail.com</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
