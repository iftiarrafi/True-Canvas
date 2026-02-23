import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="error-page-wrapper" style={{
      height: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <h1 style={{ fontSize: '10rem', opacity: '0.1', position: 'absolute', zIndex: -1 }}>403</h1>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Access Withheld</h2>
      <p style={{ color: 'var(--muted-text)', maxWidth: '500px', marginBottom: '40px', fontSize: '1.2rem' }}>
        Even art has its boundaries. It seems you've wandered into a private studio without an invitation.
      </p>
      <Link to="/" className="auth-btn" style={{ padding: '14px 40px', width: 'auto' }}>
        Return to Gallery
      </Link>
    </div>
  );
}

export default Unauthorized;