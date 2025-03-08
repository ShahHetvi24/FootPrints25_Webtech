import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import "./ViewSecretMessage.css";

function ViewSecretMessage() {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(10); // Auto-redirect countdown

  useEffect(() => {
    // Fetch the secret message
    const fetchMessage = async () => {
      try {
        const response = await axios.get(`/api/secret-messages/${uniqueId}`);
        setMessage(response.data);
        setLoading(false);

        // Start countdown for auto-redirect
        startCountdown();
      } catch (error) {
        setError(error.response?.data?.error || "An error occurred");
        setLoading(false);
      }
    };

    fetchMessage();
  }, [uniqueId]);

  const startCountdown = () => {
    // Countdown for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  if (loading) {
    return (
      <div className="view-secret loading">
        <div className="message-container">
          <h2>Loading Secret Message...</h2>
          <p>Please wait while we retrieve your message.</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-secret error">
        <div className="message-container">
          <h2>Message Not Found</h2>
          <p>{error}</p>
          <p>The message may have been already viewed or expired.</p>
          <button onClick={() => navigate("/")}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-secret">
      <div className="message-container">
        <div className="message-header">
          <h2>Secret Message</h2>
          <p className="warning">
            ⚠️ This message will not be accessible again!
          </p>
        </div>

        <div className="message-content">
          <p>{message.content}</p>
        </div>

        <div className="message-footer">
          <p className="timestamp">
            Created: {new Date(message.createdAt).toLocaleString()}
          </p>
          <p className="redirect-notice">
            Redirecting in {countdown} seconds...
          </p>
          <button onClick={() => navigate("/")}>Return Home</button>
        </div>
      </div>
    </div>
  );
}

export default ViewSecretMessage;
