import axios from "axios";
import React, { useEffect, useState } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // Fetch user session on mount
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

  // Redirect to Google OAuth
  const handleLogin = () => {
    window.location.href = "https://footprints25-webtech.onrender.com/api/v1/auth/google";
  };

  // Logout function
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
        <div className="flex items-center margin-left-10 cursor-pointer" onClick={() => window.location.href = "/"}>
          <img
            src="https://res.cloudinary.com/dqyqncjpd/image/upload/f_auto,q_auto/v1/Port/pq6dvblperd74i8wyccg"
            className="w-7"
            alt=""
          />
          <span>DarkRoom</span>
        </div>
      </div>

      <div className="nav-links">
        <a href="/rooms">TeaTok Rooms</a>
        <a href="/confessions">Public Confessions</a>
        <a href="/create-secret">Custom TeaToks</a>
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
