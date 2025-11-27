import React from 'react';
import './LegalPages.scss';

const Terms = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Terms and Conditions</h1>
                <div className="content">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <p>Please read these terms and conditions carefully before using Our Service.</p>

                    <h2>Interpretation and Definitions</h2>
                    <h3>Interpretation</h3>
                    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                    <h3>Definitions</h3>
                    <p>For the purposes of these Terms and Conditions:</p>
                    <ul>
                        <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to SAKET RANJAN.</li>
                        <li><strong>Service</strong> refers to the Website.</li>
                        <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                    </ul>

                    <h2>Acknowledgment</h2>
                    <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>

                    <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

                    <h2>Products and Pricing</h2>
                    <p>All products listed on the Service are described to the best of our ability. We reserve the right to change prices for products displayed at any time, and to correct pricing errors that may inadvertently occur. All prices are in Indian Rupees (INR).</p>

                    <h2>Contact Us</h2>
                    <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
                    <ul>
                        <li>By email: support@bastardwears.com</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Terms;
