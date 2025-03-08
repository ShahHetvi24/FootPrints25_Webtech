import React from 'react';
import { Link } from 'react-router-dom';
// import './Navbar.css';

function Navbar({ isLoggedIn, username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">Secret Confessions</Link>
      </div>

      <div className="nav-links">
        <Link to="/">Chat Rooms</Link>
        <Link to="/confessions">Public Confessions</Link>
        <Link to="/create-secret">Create Secret Message</Link>
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            <span className="username">Hi, {username}</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/" className="login-link">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;