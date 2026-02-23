import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice.jsx";
import { Link, useNavigate } from "react-router-dom";
import "../CSS/Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State to toggle menu open/close
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setMenuOpen(false); // close menu on logout
  };

  // Toggle menu open state
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu when clicking a link (mobile)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          TrueCanvas
        </Link>

        {/* Hamburger icon */}
        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
        </button>

        {/* Show nav links, toggle 'active' class on mobile */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu}>
              About
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link to="/private/create" onClick={closeMenu}>
                  Create
                </Link>
              </li>
              <li>
                <Link to="/private/profile" onClick={closeMenu}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/private/posts" onClick={closeMenu}>
                  Posts
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={closeMenu} className="login-link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
