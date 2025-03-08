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
    <div className="confession-feed w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      <h2 className="text-center mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold text-white">
        Public Confessions
      </h2>

      <form
        className="confession-form mb-6 sm:mb-8 bg-white bg-opacity-90 p-4 sm:p-6 rounded-lg shadow"
        onSubmit={postConfession}
      >
        <textarea
          className="w-full p-3 border border-gray-300 rounded resize-vertical font-inherit mb-4"
          placeholder="Share your anonymous confession..."
          value={newConfession}
          onChange={(e) => setNewConfession(e.target.value)}
          rows={4}
          required
        />

        <div className="form-controls flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="expiry-control flex items-center">
            <label className="mr-2 text-gray-800">Expires in:</label>
            <select
              className="p-2 border border-gray-300 rounded bg-white"
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

          <button
            className="px-4 py-2 bg-red-400 text-white border-none rounded cursor-pointer transition-colors duration-300 hover:bg-red-500 w-full sm:w-auto"
            type="submit"
          >
            Post Anonymously
          </button>
        </div>
      </form>

      <div className="confessions-list flex flex-col gap-4">
        {confessions.length > 0 ? (
          confessions.map((confession) => (
            <div
              key={confession._id}
              className="confession-card bg-white p-4 sm:p-5 rounded-lg shadow"
            >
              <p className="confession-content mb-3 whitespace-pre-wrap break-words">
                {confession.content}
              </p>
              <div className="confession-footer flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500">
                <span className="confession-time mb-1 sm:mb-0">
                  {new Date(confession.createdAt).toLocaleString()}
                </span>
                <span className="confession-expiry">
                  {calculateTimeRemaining(confession.expiresAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-confessions text-center py-8 bg-white rounded-lg shadow text-gray-600">
            No confessions yet. Be the first to share!
          </p>
        )}
      </div>
    </div>
  );
}

export default ConfessionFeed;
