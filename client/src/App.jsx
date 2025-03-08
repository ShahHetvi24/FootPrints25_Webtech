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

// Initialize socket connection
const socket = io("https://footprints25-webtech.onrender.com/");

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
    <div className="login-container">
      <h2>Welcome to DarkRoom</h2>
      <div className="login-input">
        <input
          type="text"
          placeholder="Username (optional)"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Enter</button>
      </div>
        <span className="bg-black/70">Enter a username to continue or remain anonymous</span>
    </div>
  );
};

// Rooms Component
const RoomsPage = ({ username, socket }) => {
  const [activeRoom, setActiveRoom] = useState(null);

  const joinRoom = (roomId) => {
    if (activeRoom) {
      socket.emit("leave_room", activeRoom);
    }

    socket.emit("join_room", roomId);
    setActiveRoom(roomId);
  };

  return (
    <div className="main-container">
      <div className="rooms-container">
        <RoomsList onRoomSelect={joinRoom} activeRoom={activeRoom} />
      </div>
      <div className="chat-container">
        {activeRoom ? (
          <ChatComponent
            room={activeRoom}
            username={username}
            socket={socket}
          />
        ) : (
          <div className="select-room-message">
            <h2>Welcome to TeaTok Room</h2>
            <p>Select a room from the left sidebar to start chatting</p>
          </div>
        )}
      </div>
    </div>
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

          <Routes>
            <Route path="/" element={<LoginPage onLogin={handleLogin} />} />

            <Route
              path="/rooms"
              element={<RoomsPage username={username} socket={socket} />}
            />

            <Route path="/confessions" element={<ConfessionFeed />} />

            <Route
              path="/create-secret"
              element={<CreateSecretMessage username={username} />}
            />

            <Route path="/view/:uniqueId" element={<ViewSecretMessage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
