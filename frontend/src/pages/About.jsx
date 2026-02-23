import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="about-wrapper" style={{ maxWidth: '900px', margin: '100px auto', padding: '0 30px' }}>
            <header style={{ textAlign: 'center', marginBottom: '80px' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '20px' }}>Our Mission</h1>
                <p style={{ fontSize: '1.4rem', color: 'var(--muted-text)', lineHeight: '1.6' }}>
                    In an era of algorithms and automated generation, we believe the human touch is irreplaceable.
                </p>
            </header>

            <section style={{ marginBottom: '80px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Pure Imagination</h2>
                        <p style={{ lineHeight: '1.8', marginBottom: '20px' }}>
                            TrueCanvas was born from a simple desire: to create a dedicated space for human artists.
                            We believe that art is more than just an image—it's a dialogue between the creator and the canvas,
                            filled with intention, imperfection, and soul.
                        </p>
                        <p style={{ lineHeight: '1.8' }}>
                            Our platform uses advanced AI detection not to create art, but to protect it.
                            Every piece shared here is verified to ensure it came from a human hand.
                        </p>
                    </div>
                    <div style={{ background: 'var(--secondary-bg)', height: '400px', borderRadius: '32px' }}></div>
                </div>
            </section>

            <footer style={{ textAlign: 'center', background: 'var(--text-color)', color: 'white', padding: '60px', borderRadius: '32px' }}>
                <h2 style={{ marginBottom: '20px' }}>Join the Movement</h2>
                <p style={{ marginBottom: '30px', opacity: 0.8 }}>Protect the future of human creativity.</p>
                <Link to="/register" style={{
                    background: 'var(--white)',
                    color: 'var(--text-color)',
                    padding: '14px 40px',
                    borderRadius: '50px',
                    fontWeight: '700',
                    display: 'inline-block'
                }}>
                    Become a Creator
                </Link>
            </footer>
        </div>
    );
};

export default About;
