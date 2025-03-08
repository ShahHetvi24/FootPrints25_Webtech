import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    axios
      .get("https://footprints25-webtech.onrender.com/api/v1/auth/getProfile", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Session data:", res.data);
        if (res.data.loggedIn) {
          setIsLoggedIn(true);
          setUsername(res.data.username);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));
  }, []);

  const handleLogin = () => {
    window.location.href =
      "https://footprints25-webtech.onrender.com/api/v1/auth/google";
  };

  const handleLogout = () => {
    axios
      .post(
        "https://footprints25-webtech.onrender.com/api/v1/auth/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        setIsLoggedIn(false);
        setUsername("");
      })
      .catch((err) => console.error("Error logging out:", err));
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link
          to="/"
          className="flex items-center margin-left-10 cursor-pointer"
        >
          <img
            src="https://res.cloudinary.com/dqyqncjpd/image/upload/f_auto,q_auto/v1/Port/pq6dvblperd74i8wyccg"
            className="w-7"
            alt="DarkRoom logo"
          />
          <span>DarkRoom</span>
        </Link>
      </div>

      <div className="nav-links">
        <NavLink to="/rooms">TeaTok Rooms</NavLink>
        <NavLink to="/confessions">Public Confessions</NavLink>
        <NavLink to="/create-secret">Custom TeaToks</NavLink>
      </div>

      <div className="nav-auth">
        {isLoggedIn ? (
          <>
            <span className="username">Hi, {username}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className="login-link" onClick={handleLogin}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
