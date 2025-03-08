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
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-500 p-2"></div>
          <div className="p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Message Not Found
            </h2>
            <p className="text-red-600 mb-2">{error}</p>
            <p className="text-gray-600 mb-6">
              The message may have been already viewed or expired.
            </p>
            <button
              className="bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-6 rounded-md transition duration-300"
              onClick={() => navigate("/")}
            >
              Return Home
            </button>
          </div>
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
