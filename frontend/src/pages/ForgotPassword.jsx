import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../api";

const API = `${API_URL}/user/password-reset`;
const ForgotPassword = () => {
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (step === "request") {
        const { data } = await axios.post(`${API}/request`, { email });
        setMessage(data.message);
        setStep("verify");
      } else if (step === "verify") {
        const { data } = await axios.post(`${API}/verify`, { email, otp });
        setResetToken(data.resetToken);
        setMessage("OTP verified. Choose a new password.");
        setStep("confirm");
      } else {
        const { data } = await axios.post(`${API}/confirm`, {
          resetToken,
          newpassword: password,
        });
        setMessage(data.message);
        setStep("done");
      }
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  if (step === "done")
    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="success-alert">
            {message}
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>
    );
  const prompt =
    step === "request"
      ? "Enter your email to receive a one-time code."
      : step === "verify"
        ? "Enter the code sent to your email."
        : "Choose a new password.";
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Restore Access</h2>
          <p>{prompt}</p>
        </div>
        {message && <div className="success-alert">{message}</div>}
        {error && <div className="error-alert">{error}</div>}
        <form onSubmit={submit} className="auth-form">
          {step === "request" && (
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
          {step === "verify" && (
            <div className="form-group">
              <label>OTP</label>
              <input
                inputMode="numeric"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}
          {step === "confirm" && (
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                minLength="8"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading
              ? "Please wait..."
              : step === "request"
                ? "Send OTP"
                : step === "verify"
                  ? "Verify OTP"
                  : "Reset Password"}
          </button>
        </form>
        <div className="auth-footer">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
