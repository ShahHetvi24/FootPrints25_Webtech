import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
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

// Set up axios defaults
axios.defaults.baseURL = "http://localhost:8000";

// Initialize socket connection
const socket = io("http://localhost:8000");

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);

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
    // Simple anonymous login
    setUsername(name || `Anonymous-${Math.floor(Math.random() * 1000)}`);
    setIsLoggedIn(true);
    localStorage.setItem(
      "username",
      name || `Anonymous-${Math.floor(Math.random() * 1000)}`
    );
  };

  const handleLogout = () => {
    setUsername("");
    setIsLoggedIn(false);
    setActiveRoom(null);
    localStorage.removeItem("username");
  };

  const joinRoom = (roomId) => {
    if (activeRoom) {
      socket.emit("leave_room", activeRoom);
    }

    socket.emit("join_room", roomId);
    setActiveRoom(roomId);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar
          isLoggedIn={isLoggedIn}
          username={username}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <div className="main-container">
                  <div className="rooms-container">
                    <RoomsList
                      onRoomSelect={joinRoom}
                      activeRoom={activeRoom}
                    />
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
                        <h2>Welcome to Secret Confessions</h2>
                        <p>
                          Select a room from the left sidebar to start chatting
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="login-container">
                  <h2>Welcome to Secret Confessions</h2>
                  <p>Enter a username to continue or remain anonymous</p>
                  <input
                    type="text"
                    placeholder="Username (optional)"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button onClick={() => handleLogin(username)}>Enter</button>
                </div>
              )
            }
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
    </Router>
  );
}

export default App;