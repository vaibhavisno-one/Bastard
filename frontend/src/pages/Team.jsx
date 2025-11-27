import React from 'react';
import TiltedCard from '../components/TiltedCard';
import './LegalPages.scss'; // Reusing styles for layout

const Team = () => {
    const teamMembers = [
        {
            name: "Saket Ranjan",
            role: "Founder",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm91bmRlciUyMHBvcnRyYWl0fGVufDB8fDB8fHww", // Placeholder
        },
        {
            name: "Aarav Sharma",
            role: "Tech Lead",
            image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZGV2ZWxvcGVyfGVufDB8fDB8fHww", // Placeholder
        },
        {
            name: "Riya Patel",
            role: "Distribution Head",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVzaW5lc3MlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D", // Placeholder
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
