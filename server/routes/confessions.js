const express = require("express");
const router = express.Router();
const confessionController = require("../controllers/confessionController");
const { optionalAuth } = require("../middlewares/auth");

// Get all confessions
router.get("/", confessionController.getConfessions);

// Create a confession
router.post("/", optionalAuth, confessionController.createConfession);

// Like a confession
router.post("/:id/like", confessionController.likeConfession);

// Add comment to confession
router.post("/:id/comments", optionalAuth, confessionController.addComment);

module.exports = router;
