const express = require("express");
const router = express.Router();
const secretMessageController = require("../controllers/secretMessageController");
const { optionalAuth } = require("../middlewares/auth");

// Create a secret message
router.post("/", optionalAuth, secretMessageController.createSecretMessage);

// Read a secret message
router.get("/:token", secretMessageController.readSecretMessage);

module.exports = router;
