import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/AuthSlice.jsx";
import { useNavigate, Link } from "react-router-dom";
import "../CSS/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Login | TrueCanvas";
    if (token) {
      navigate("/private/posts");
    }
  }, [token, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sigin in to continue your artistic journey.</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. artist@truecanvas.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <Link to="/forgot-password">Forgot?</Link>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>New to TrueCanvas? <Link to="/register">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
