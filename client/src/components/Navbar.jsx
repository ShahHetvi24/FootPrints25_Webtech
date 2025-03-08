import React from 'react';
import { Link } from 'react-router-dom';
// import './Navbar.css';

function Navbar({ isLoggedIn, username, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className='flex items-center margin-left-10'>

        <img src="../assets/darkRoom.png" className='w-7' alt="" />
        <Link to="/">DarkRoom</Link>
        </div>
      </div>

      <div className="nav-links">
        <Link to="/">TeaTok Rooms</Link>
        <Link to="/confessions">Public Confessions</Link>
        <Link to="/create-secret">Custom TeaToks</Link>
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