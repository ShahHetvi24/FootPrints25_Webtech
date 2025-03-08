import React, { useState, useEffect, useRef } from "react";
// import "./ChatComponent.css";
import { SendHorizontal } from "lucide-react";

function ChatComponent({ room, username, socket }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Listen for new messages
    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Listen for message history
    socket.on("message_history", (history) => {
      setMessages(history);
    });

    return () => {
      socket.off("receive_message");
      socket.off("message_history");
    };
  }, [socket]);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Send message to server
    socket.emit("send_message", {
      content: message,
      room,
      sender: username,
      expiresInHours: 24, // Messages expire after 24 hours
    });

    setMessage("");
  };

  return (
    <div className="chat-component">
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender === username ? "own-message" : "other-message"
            }`}
          >
            <div className="message-content">
              <p>{msg.content}</p>
              <div className="message-info">
                <span className="sender">{msg.sender}</span>
                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit"><SendHorizontal /></button>
      </form>
    </div>
  );
}

export default ChatComponent;
