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
                        <p><strong>Email:</strong> bastardwears@gmail.com</p>
                        <p><strong>Phone:</strong> +91 6205738409</p>
                        <p><strong>Operating Address:</strong></p>
                        <address>
                            GLA University<br />
                            Mathura, 281406<br />
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
