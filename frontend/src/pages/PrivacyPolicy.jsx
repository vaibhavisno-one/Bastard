import React from 'react';
import './LegalPages.scss';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>Privacy Policy</h1>
                <div className="content">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>

                    <h2>Interpretation and Definitions</h2>
                    <h3>Interpretation</h3>
                    <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                    <h3>Definitions</h3>
                    <p>For the purposes of this Privacy Policy:</p>
                    <ul>
                        <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                        <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to SAKET RANJAN.</li>
                        <li><strong>Service</strong> refers to the Website.</li>
                        <li><strong>Website</strong> refers to bastard_wears, accessible from https://bastardwears.com</li>
                    </ul>

                    <h2>Collecting and Using Your Personal Data</h2>
                    <h3>Types of Data Collected</h3>
                    <h4>Personal Data</h4>
                    <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
                    <ul>
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Phone number</li>
                        <li>Address, State, Province, ZIP/Postal code, City</li>
                    </ul>

                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                    <ul>
                        <li>By email: support@bastardwears.com</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
