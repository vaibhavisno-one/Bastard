import React from 'react';
import './LegalPages.scss';

const Contact = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Contact Us</h1>
                <div className="content">
                    <p>We'd love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to say hello, our team is here to help.</p>

                    <div className="contact-details">
                        <h3>Get in Touch</h3>
                        <p><strong>Legal Entity Name:</strong> SAKET RANJAN</p>
                        <p><strong>Email:</strong> support@bastardwears.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <p><strong>Operating Address:</strong></p>
                        <address>
                            123 Street Name,<br />
                            City, State, Zip Code,<br />
                            India
                        </address>
                    </div>

                    <div className="contact-form-placeholder">
                        <h3>Send us a Message</h3>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" placeholder="Your Name" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="Your Email" />
                            </div>
                            <div className="form-group">
                                <label>Message</label>
                                <textarea rows="5" placeholder="How can we help?"></textarea>
                            </div>
                            <button className="submit-btn">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
