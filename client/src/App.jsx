import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:8000", {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
      setError("");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    newSocket.on("error", (data) => {
      console.error("Socket error:", data.message);
      setError(data.message);
    });

    newSocket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on("roomHistory", (data) => {
      setMessages(data);
    });

    newSocket.on("userJoined", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          system: true,
          content: `${data.username} joined the room`,
          createdAt: new Date(data.timestamp),
        },
      ]);
    });

    newSocket.on("userLeft", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          system: true,
          content: `${data.username} left the room`,
          createdAt: new Date(data.timestamp),
        },
      ]);
    });

    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch available public rooms
  useEffect(() => {
    if (connected) {
      fetchRooms();
    }
  }, [connected]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchRooms = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/rooms/public",
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to fetch rooms");
    }
  };

  const createRoom = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: prompt("Enter room name:") || "New Room",
          description: prompt("Enter room description:") || "A chat room",
          isPrivate: false,
          messageExpiryHours: 24,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.room) {
        setRooms([...rooms, data.room]);
      }
    } catch (err) {
      console.error("Error creating room:", err);
      setError("Failed to create room");
    }
  };

  const joinRoom = (roomId) => {
    if (!socket || !username) {
      setError("Please enter a username first");
      return;
    }

    setCurrentRoom(roomId);
    setMessages([]);
    setError("");

    // Generate random avatar
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${socket.id}`;

    socket.emit("joinRoom", { roomId, username, avatar });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!socket || !message || !currentRoom) return;

    socket.emit("chatMessage", message);
    setMessage("");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div
      className="app-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}
    >
      <h1>Secret Confessions Chat</h1>

      {error && (
        <div
          style={{
            background: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          Error: {error}
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <h2>
          Connection Status: {connected ? "✅ Connected" : "❌ Disconnected"}
        </h2>
      </div>

      {!username ? (
        <div style={{ marginBottom: "20px" }}>
          <h2>Enter Username</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={() =>
                setUsername(
                  username || `Anonymous-${Math.floor(Math.random() * 10000)}`
                )
              }
              style={{
                padding: "8px 16px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Set Username
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>Welcome, {username}</h2>
            <button
              onClick={createRoom}
              style={{
                padding: "8px 16px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Create New Room
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              height: "calc(100vh - 250px)",
            }}
          >
            {/* Room list */}
            <div
              style={{
                width: "30%",
                border: "1px solid #ddd",
                borderRadius: "4px",
                overflow: "auto",
              }}
            >
              <h3
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  margin: 0,
                  backgroundColor: "#f5f5f5",
                }}
              >
                Available Rooms
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {rooms.map((room) => (
                  <li
                    key={room._id}
                    onClick={() => joinRoom(room._id)}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      backgroundColor:
                        currentRoom === room._id ? "#e3f2fd" : "transparent",
                    }}
                  >
                    <strong>{room.name}</strong>
                    <p
                      style={{
                        margin: "5px 0 0",
                        fontSize: "0.8rem",
                        color: "#666",
                      }}
                    >
                      {room.description}
                    </p>
                  </li>
                ))}
                {rooms.length === 0 && (
                  <li style={{ padding: "10px", color: "#666" }}>
                    No rooms available
                  </li>
                )}
              </ul>
              <div style={{ padding: "10px" }}>
                <button
                  onClick={fetchRooms}
                  style={{
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Refresh Rooms
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div
              style={{
                width: "70%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <h3 style={{ margin: 0 }}>
                  {currentRoom
                    ? rooms.find((r) => r._id === currentRoom)?.name ||
                      "Chat Room"
                    : "Select a room to join"}
                </h3>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: "10px",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      alignSelf: msg.system
                        ? "center"
                        : msg.sender?.userId === socket.id
                        ? "flex-end"
                        : "flex-start",
                      backgroundColor: msg.system
                        ? "#f5f5f5"
                        : msg.sender?.userId === socket.id
                        ? "#e3f2fd"
                        : "#f1f1f1",
                      maxWidth: "70%",
                    }}
                  >
                    {!msg.system && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          marginBottom: "3px",
                          color: "#666",
                        }}
                      >
                        {msg.sender?.username} • {formatTime(msg.createdAt)}
                      </div>
                    )}
                    <div>{msg.content}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {currentRoom && (
                <form
                  onSubmit={sendMessage}
                  style={{
                    display: "flex",
                    padding: "10px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      marginRight: "10px",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!message}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: message ? "#4CAF50" : "#e0e0e0",
                      color: message ? "white" : "#9e9e9e",
                      border: "none",
                      borderRadius: "4px",
                      cursor: message ? "pointer" : "default",
                    }}
                  >
                    Send
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
