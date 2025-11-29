import React from 'react';
import TiltedCard from '../components/TiltedCard';
import './LegalPages.scss'; // Reusing styles for layout

const Team = () => {
    const teamMembers = [
        {
            name: "Saket Ranjan",
            role: "Founder",
            image: "/Founder.jpg",
        },
        {
            name: "Suryansh Pathak",
            role: "Distribution Head",
            image: "/Distribution.jpg",
        },
        {
            name: "Mahak Mittal",
            role: "Design Head",
            image: "/DesignLead.jpg",
        },
        {
            name: "Vaibhav Kumar",
            role: "Tech Lead",
            image: "/yorolovo.jpeg",
        }

    ];

    return (
        <div className="legal-page">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <h1>Meet Our Team</h1>
                <p style={{ textAlign: 'center', marginBottom: '4rem', color: '#666', fontSize: '1.2rem' }}>
                    The minds behind the madness.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '4rem',
                    paddingBottom: '4rem'
                }}>
                    {teamMembers.map((member, index) => (
                        <TiltedCard
                            key={index}
                            imageSrc={member.image}
                            altText={member.name}
                            captionText={member.role}
                            containerHeight="400px"
                            containerWidth="300px"
                            imageHeight="400px"
                            imageWidth="300px"
                            rotateAmplitude={12}
                            scaleOnHover={1.1}
                            showMobileWarning={false}
                            showTooltip={true}
                            displayOverlayContent={true}
                            overlayContent={
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{member.name}</h3>
                                    <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>{member.role}</p>
                                </div>
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Team;
