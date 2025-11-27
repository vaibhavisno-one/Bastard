import React from 'react';
import './LegalPages.scss';

const About = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>About Us</h1>
                <div className="content">
                    <p>Welcome to <strong>bastard_wears</strong>, where style meets bold expression.</p>

                    <p>
                        At bastard_wears, we believe that fashion is more than just clothing—it's a statement.
                        Our mission is to provide high-quality, trendsetting streetwear that empowers you to
                        showcase your unique identity to the world.
                    </p>

                    <p>
                        Founded with a passion for modern aesthetics and premium craftsmanship, we curate collections
                        that blend comfort with cutting-edge design. Whether you're looking for the perfect hoodie,
                        a graphic tee that speaks your mind, or accessories to complete your look, we've got you covered.
                    </p>

                    <p>
                        We are committed to sustainability and ethical practices, ensuring that looking good
                        doesn't come at the cost of our planet. Join our community of trendsetters and
                        redefine what it means to be bold.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
