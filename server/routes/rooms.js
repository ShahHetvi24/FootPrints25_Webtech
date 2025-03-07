const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { optionalAuth } = require("../middlewares/auth");

// Get all public rooms
router.get("/public", roomController.getPublicRooms);

// Create a new room
router.post("/", optionalAuth, roomController.createRoom);

// Get room by ID
router.get("/:id", roomController.getRoomById);

// Get room by shareable link
router.get("/join/:link", roomController.getRoomByShareableLink);

// Add user to private room
router.post("/add-user", roomController.addUserToPrivateRoom);

module.exports = router;
