import React from 'react';
import './LegalPages.scss';

const FAQ = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Frequently Asked Questions</h1>
                <div className="content">
                    <div className="faq-item">
                        <h3>How do I place an order?</h3>
                        <p>Simply browse our products, select your size, and click "Add to Cart". Once you're ready, proceed to checkout and follow the instructions to complete your purchase.</p>
                    </div>

                    <div className="faq-item">
                        <h3>What payment methods do you accept?</h3>
                        <p>We accept all major credit/debit cards, UPI, Net Banking, and Wallet payments via our secure payment gateway.</p>
                    </div>

                    <div className="faq-item">
                        <h3>How can I track my order?</h3>
                        <p>Once your order is shipped, you will receive a tracking link via email/SMS. You can also track your order status on our "Track Order" page.</p>
                    </div>

                    <div className="faq-item">
                        <h3>What is your return policy?</h3>
                        <p>We offer a 7-day return policy for unused and undamaged items. Please visit our Refund Policy page for more details.</p>
                    </div>

                    <div className="faq-item">
                        <h3>Do you ship internationally?</h3>
                        <p>Currently, we only ship within India. We are working on expanding our shipping to other countries soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
