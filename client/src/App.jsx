import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// import "./App.css";

// Components
import ChatComponent from "./components/ChatComponent";
import RoomsList from "./components/RoomList";
import ConfessionFeed from "./components/ConfessionFeed";
import CreateSecretMessage from "./components/CreateSecretMessage";
import ViewSecretMessage from "./components/ViewSecretMessage";
import Navbar from "./components/Navbar";
import LetterGlitch from "./components/LetterGlitch";

// Set up axios defaults
axios.defaults.baseURL = "https://footprints25-webtech.onrender.com/";
// axios.defaults.baseURL = "http://localhost:8000/";

// Initialize socket connection
const socket = io("https://footprints25-webtech.onrender.com/");
// const socket = io("http://localhost:8000/");

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Login Component
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const finalUsername =
      username || `Anonymous-${Math.floor(Math.random() * 1000)}`;
    onLogin(finalUsername);
    navigate("/rooms");
  };

  return (
    <motion.div
      className="login-container"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <motion.h2
        className="login-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Welcome to DarkRoom
      </motion.h2>
      <motion.div
        className="login-input"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Username (optional)"
          onChange={(e) => setUsername(e.target.value)}
        />
        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </motion.div>
      <motion.span
        className="bg-black/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        Enter a username to continue or remain anonymous
      </motion.span>
    </motion.div>
  );
};

// Rooms Component with enhanced animations
const RoomsPage = ({ username, socket }) => {
  const [activeRoom, setActiveRoom] = useState(null);

  const joinRoom = (roomId) => {
    if (activeRoom) {
      socket.emit("leave_room", activeRoom);
    }

    socket.emit("join_room", roomId);
    setActiveRoom(roomId);
  };

  // Enhanced animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const roomsListVariants = {
    initial: { opacity: 0, x: -100 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.3 },
    },
  };

  const chatContainerVariants = {
    initial: { opacity: 0, x: 100 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        delay: 0.2,
      },
    },
    exit: {
      opacity: 0,
      x: 50,
      transition: { duration: 0.3 },
    },
  };

  const welcomeMessageVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.5,
      },
    },
  };

  const subtitleVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.7,
      },
    },
  };

  return (
    <motion.div
      className="main-container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div className="rooms-container" variants={roomsListVariants}>
        <RoomsList onRoomSelect={joinRoom} activeRoom={activeRoom} />
      </motion.div>
      <motion.div className="chat-container" variants={chatContainerVariants}>
        <AnimatePresence mode="wait">
          {activeRoom ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              <ChatComponent
                room={activeRoom}
                username={username}
                socket={socket}
              />
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              className="select-room-message"
              variants={welcomeMessageVariants}
            >
              <motion.h2 variants={titleVariants}>
                Welcome to TeaTok Room
              </motion.h2>
              <motion.p variants={subtitleVariants}>
                Select a room from the left sidebar to start chatting
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for stored username
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsLoggedIn(true);
    }

    // Socket connection events
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleLogin = (name) => {
    setUsername(name);
    setIsLoggedIn(true);
    localStorage.setItem("username", name);
  };

  const handleLogout = () => {
    setUsername("");
    setIsLoggedIn(false);
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <div className="app-container relative">
        <div className="fixed inset-0 z-0">
          <LetterGlitch
            glitchColors={["#F7F7FF", "#A1525F", "#F9AAAD"]}
            glitchSpeed={100}
            outerVignette={true}
            smooth={true}
          />
        </div>
        <div className="relative z-10 flex flex-col h-screen">
          <Navbar
            isLoggedIn={isLoggedIn}
            username={username}
            onLogout={handleLogout}
          />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

              <Route
                path="/rooms"
                element={<RoomsPage username={username} socket={socket} />}
              />

              <Route
                path="/confessions"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <ConfessionFeed />
                  </motion.div>
                }
              />

              <Route
                path="/create-secret"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <CreateSecretMessage username={username} />
                  </motion.div>
                }
              />

              <Route
                path="/view/:uniqueId"
                element={
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <ViewSecretMessage />
                  </motion.div>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </Router>
  );
}

export default App;
