import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/AuthSlice.jsx";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/Login.css";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        contact_no: ""
    });

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        document.title = "Register | TrueCanvas";
        if (token) {
            navigate("/private/posts");
        }
    }, [token, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(formData)).then((res) => {
            if (!res.error) {
                setSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            }
        });
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Join the Collective</h2>
                    <p>Create an account to start sharing your human-made art.</p>
                </div>

                {error && <div className="error-alert">{error}</div>}
                {success && <div className="success-alert" style={{ backgroundColor: '#e6f4ea', color: '#1e8e3e', padding: '12px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>Registration successful! Redirecting to login...</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            placeholder="e.g. leonardo_da_vinci"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="e.g. artist@truecanvas.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Contact Number</label>
                        <input
                            type="text"
                            name="contact_no"
                            required
                            placeholder="e.g. 123456789"
                            value={formData.contact_no}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="Minimum 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" disabled={loading} className="auth-btn">
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign In</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
