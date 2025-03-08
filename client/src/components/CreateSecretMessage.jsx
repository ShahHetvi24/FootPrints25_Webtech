import React, { useState } from "react";
import axios from "axios";
// import "./CreateSecretMessage.css";

function CreateSecretMessage({ username }) {
  const [content, setContent] = useState("");
  const [expiresIn, setExpiresIn] = useState(24);
  const [secretLink, setSecretLink] = useState("");
  const [expiryTime, setExpiryTime] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const createSecretMessage = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      const response = await axios.post("/api/secret-messages", {
        content,
        expiresInHours: expiresIn,
      });

      // Get the full URL for sharing
      const fullUrl = `${window.location.origin}${response.data.link}`;
      setSecretLink(fullUrl);
      setExpiryTime(new Date(response.data.expiresAt));
      setContent("");
    } catch (error) {
      console.error("Error creating secret message:", error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(secretLink)
      .then(() => {
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  return (
    <div className="create-secret">
      <h2>Create a One-Time Secret Message</h2>
      <p className="description">
        This message will self-destruct after being viewed once or when it
        expires.
      </p>

      {!secretLink ? (
        <form className="secret-form" onSubmit={createSecretMessage}>
          <textarea
            placeholder="Your secret message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            required
          />

          <div className="form-controls">
            <div className="expiry-control">
              <label>Expires in:</label>
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              >
                <option value={1}>1 hour</option>
                <option value={6}>6 hours</option>
                <option value={12}>12 hours</option>
                <option value={24}>24 hours</option>
                <option value={48}>48 hours</option>
                <option value={72}>3 days</option>
              </select>
            </div>

            <button type="submit">Create Secret Link</button>
          </div>
        </form>
      ) : (
        <div className="secret-link-container">
          <h3>Your secret message has been created!</h3>

          <div className="expiry-info">
            <p>This link will expire on:</p>
            <p className="expiry-date">{expiryTime.toLocaleString()}</p>
          </div>

          <div className="link-box">
            <input type="text" value={secretLink} readOnly />
            <button onClick={copyToClipboard}>{copySuccess || "Copy"}</button>
          </div>

          <div className="warning-note">
            <p>⚠️ Important: This link can only be viewed ONCE!</p>
            <p>After viewing, the message will be permanently deleted.</p>
          </div>

          <button className="create-new-btn" onClick={() => setSecretLink("")}>
            Create Another Secret
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateSecretMessage;
