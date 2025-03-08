import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// import "./ConfessionFeed.css";

function ConfessionFeed() {
  const [confessions, setConfessions] = useState([]);
  const [newConfession, setNewConfession] = useState("");
  const [expiresIn, setExpiresIn] = useState(24);
  const [isFormFocused, setIsFormFocused] = useState(false);

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // const formVariants = {
  //   normal: {
  //     scale: 1,
  //     boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  //   },
  //   focused: {
  //     scale: 1.01,
  //     boxShadow: "0 10px 15px rgba(0, 0, 0, 0.2)",
  //   },
  // };

  return (
    <motion.div
      className="confession-feed w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-center mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold text-white"
        variants={itemVariants}
      >
        Public Confessions
      </motion.h2>

      <motion.form
        className="confession-form mb-6 sm:mb-8 bg-white bg-opacity-90 p-4 sm:p-6 rounded-lg shadow"
        onSubmit={postConfession}
        variants={itemVariants}
        initial="normal"
        animate={isFormFocused ? "focused" : "normal"}
        // variants={formVariants}
        transition={{ duration: 0.3 }}
      >
        <motion.textarea
          className="w-full p-3 border border-gray-300 rounded resize-vertical font-inherit mb-4"
          placeholder="Share your anonymous confession..."
          value={newConfession}
          onChange={(e) => setNewConfession(e.target.value)}
          onFocus={() => setIsFormFocused(true)}
          onBlur={() => setIsFormFocused(false)}
          rows={4}
          required
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />

        <motion.div
          className="form-controls flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          variants={itemVariants}
        >
          <div className="expiry-control flex items-center">
            <label className="mr-2 text-gray-800">Expires in:</label>
            <motion.select
              className="p-2 border border-gray-300 rounded bg-white"
              value={expiresIn}
              onChange={(e) => setExpiresIn(parseInt(e.target.value))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={12}>12 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>3 days</option>
            </motion.select>
          </div>

          <motion.button
            className="px-4 py-2 bg-red-400 text-white border-none rounded cursor-pointer transition-colors duration-300 hover:bg-red-500 w-full sm:w-auto"
            type="submit"
            whileHover={{
              scale: 1.05,
              backgroundColor: "#ef4444",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Post Anonymously
          </motion.button>
        </motion.div>
      </motion.form>

      <motion.div
        className="confessions-list flex flex-col gap-4"
        variants={containerVariants}
      >
        <AnimatePresence>
          {confessions.length > 0 ? (
            confessions.map((confession) => (
              <motion.div
                key={confession._id}
                className="confession-card bg-white p-4 sm:p-5 rounded-lg shadow"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 100 }}
                layout
              >
                <motion.p
                  className="confession-content mb-3 whitespace-pre-wrap break-words"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {confession.content}
                </motion.p>
                <motion.div
                  className="confession-footer flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="confession-time mb-1 sm:mb-0">
                    {new Date(confession.createdAt).toLocaleString()}
                  </span>
                  <motion.span
                    className="confession-expiry"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatType: "reverse",
                    }}
                  >
                    {calculateTimeRemaining(confession.expiresAt)}
                  </motion.span>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <motion.p
              className="no-confessions text-center py-8 bg-white rounded-lg shadow text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No confessions yet. Be the first to share!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default ConfessionFeed;
