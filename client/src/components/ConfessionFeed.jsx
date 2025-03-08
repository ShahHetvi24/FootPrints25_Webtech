import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./ConfessionFeed.css";

function ConfessionFeed() {
  const [confessions, setConfessions] = useState([]);
  const [newConfession, setNewConfession] = useState("");
  const [expiresIn, setExpiresIn] = useState(24);

  useEffect(() => {
    fetchConfessions();

    // Refresh confessions every minute to update timers
    const interval = setInterval(fetchConfessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchConfessions = async () => {
    try {
      const response = await axios.get("/api/confessions");
      setConfessions(response.data);
    } catch (error) {
      console.error("Error fetching confessions:", error);
    }
  };

  const postConfession = async (e) => {
    e.preventDefault();

    if (!newConfession.trim()) return;

    try {
      await axios.post("/api/confessions", {
        content: newConfession,
        expiresInHours: expiresIn,
      });

      setNewConfession("");
      fetchConfessions();
    } catch (error) {
      console.error("Error posting confession:", error);
    }
  };

  const calculateTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="confession-feed">
      <h2>Public Confessions</h2>

      <form className="confession-form" onSubmit={postConfession}>
        <textarea
          placeholder="Share your anonymous confession..."
          value={newConfession}
          onChange={(e) => setNewConfession(e.target.value)}
          rows={4}
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

          <button type="submit">Post Anonymously</button>
        </div>
      </form>

      <div className="confessions-list">
        {confessions.length > 0 ? (
          confessions.map((confession) => (
            <div key={confession._id} className="confession-card">
              <p className="confession-content">{confession.content}</p>
              <div className="confession-footer">
                <span className="confession-time">
                  {new Date(confession.createdAt).toLocaleString()}
                </span>
                <span className="confession-expiry">
                  {calculateTimeRemaining(confession.expiresAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-confessions">
            No confessions yet. Be the first to share!
          </p>
        )}
      </div>
    </div>
  );
}

export default ConfessionFeed;
