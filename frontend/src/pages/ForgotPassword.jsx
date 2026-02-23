import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("If an account exists for this email, you will receive reset instructions shortly.");
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Restore Access</h2>
                    <p>Enter your email to receive a recovery link.</p>
                </div>

                {message ? (
                    <div className="success-alert" style={{ background: '#e6f4ea', color: '#1e8e3e', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                        {message}
                        <div style={{ marginTop: '20px' }}>
                            <Link to="/login" style={{ fontWeight: '600', textDecoration: 'underline' }}>Back to Login</Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="artist@truecanvas.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="auth-btn">
                            Send Reset Link
                        </button>
                    </form>
                )}

                {!message && (
                    <div className="auth-footer">
                        <p>Remembered your password? <Link to="/login">Sign In</Link></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
