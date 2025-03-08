import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.nav
      className="navbar"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <motion.div className="nav-brand" variants={navItemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/"
            className="flex items-center margin-left-10 cursor-pointer"
          >
            <motion.img
              src="https://res.cloudinary.com/dqyqncjpd/image/upload/f_auto,q_auto/v1/Port/pq6dvblperd74i8wyccg"
              className="w-7"
              alt="DarkRoom logo"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.span
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              DarkRoom
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="nav-links" variants={navItemVariants}>
        <motion.div
          whileHover={{
            scale: 1.1,
            textShadow: "0px 0px 8px rgb(255,255,255)",
          }}
          variants={navItemVariants}
        >
          <NavLink to="/rooms">TeaTok Rooms</NavLink>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.1,
            textShadow: "0px 0px 8px rgb(255,255,255)",
          }}
          variants={navItemVariants}
        >
          <NavLink to="/confessions">Public Confessions</NavLink>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.1,
            textShadow: "0px 0px 8px rgb(255,255,255)",
          }}
          variants={navItemVariants}
        >
          <NavLink to="/create-secret">Custom TeaToks</NavLink>
        </motion.div>
      </motion.div>

      <motion.div className="nav-auth" variants={navItemVariants}>
        <AnimatePresence mode="wait">
          {isLoggedIn ? (
            <motion.div
              key="logged-in"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <motion.span
                className="username"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Hi, {username}
              </motion.span>
              <motion.button
                className="logout-btn"
                onClick={handleLogout}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#a1525f",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="logged-out"
              className="login-link"
              onClick={handleLogin}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "#a1525f",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Login
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.nav>
  );
}

export default Navbar;
