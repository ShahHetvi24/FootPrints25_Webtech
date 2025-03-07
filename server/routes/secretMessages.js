const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const  SecretMessage  = require("../models/SecretMessage");
const Redis = require("ioredis");

// Initialize Redis client for message view tracking
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

// Generate a unique ID for secret messages
const generateUniqueId = () => {
  return crypto.randomBytes(16).toString("hex");
};

// Create a new secret message
router.post("/", async (req, res) => {
  try {
    const { content, expiryHours, hasPassword, password } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // Set expiry time (default 24 hours if not specified)
    const hours = expiryHours || 24;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + hours);

    // Generate unique ID for the message
    const uniqueId = generateUniqueId();

    // Hash password if provided
    let hashedPassword = null;
    if (hasPassword && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create new message
    const secretMessage = new SecretMessage({
      content,
      uniqueId,
      expiresAt,
      password: hashedPassword,
    });

    await secretMessage.save();

    // Store in Redis with TTL for quick lookup (same expiry time as MongoDB)
    const ttlSeconds = hours * 60 * 60;
    await redis.set(
      `message:${uniqueId}`,
      JSON.stringify({
        id: secretMessage._id.toString(),
        hasPassword: !!hashedPassword,
      }),
      "EX",
      ttlSeconds
    );

    res.status(201).json({
      success: true,
      message: "Secret message created",
      url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/secret/${uniqueId}`,
      expiresAt,
      hasPassword: !!hashedPassword,
    });
  } catch (error) {
    console.error("Error creating secret message:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create secret message" });
  }
});

// Get a secret message by its unique ID (and potentially delete it)
router.get("/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;

    // Check Redis first for faster lookup
    const cachedMessage = await redis.get(`message:${uniqueId}`);

    if (!cachedMessage) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Message not found or already viewed",
        });
    }

    const { id, hasPassword } = JSON.parse(cachedMessage);

    // If the message has a password, don't retrieve it yet, just indicate it's password protected
    if (hasPassword && !req.query.passwordEntered) {
      return res.status(200).json({
        success: true,
        requiresPassword: true,
        message: "This message is password protected",
      });
    }

    // Retrieve the message from MongoDB
    const secretMessage = await SecretMessage.findOne({
      _id: id,
      uniqueId,
      isRead: false,
      expiresAt: { $gt: new Date() },
    });

    if (!secretMessage) {
      // If message was in Redis but not in MongoDB, clean up Redis
      await redis.del(`message:${uniqueId}`);
      return res
        .status(404)
        .json({
          success: false,
          message: "Message not found or already viewed",
        });
    }

    // Verify password if message is password protected
    if (secretMessage.password) {
      const passwordMatches = await bcrypt.compare(
        req.query.password || "",
        secretMessage.password
      );
      if (!passwordMatches) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }
    }

    // Mark as read immediately
    secretMessage.isRead = true;
    await secretMessage.save();

    // Delete from Redis
    await redis.del(`message:${uniqueId}`);

    // Schedule deletion from MongoDB (give some buffer time)
    setTimeout(async () => {
      try {
        await SecretMessage.deleteOne({ _id: secretMessage._id });
        console.log(`Message ${uniqueId} permanently deleted`);
      } catch (error) {
        console.error(`Error deleting message ${uniqueId}:`, error);
      }
    }, 5000); // 5 seconds buffer

    res.status(200).json({
      success: true,
      message: "Message retrieved successfully",
      content: secretMessage.content,
      createdAt: secretMessage.createdAt,
      expiresAt: secretMessage.expiresAt,
      oneTimeView: true,
    });
  } catch (error) {
    console.error("Error retrieving secret message:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve secret message" });
  }
});

// Check if a message exists without viewing it
router.head("/:uniqueId", async (req, res) => {
  try {
    const { uniqueId } = req.params;

    // Check Redis first
    const exists = await redis.exists(`message:${uniqueId}`);

    if (exists) {
      return res.status(200).end();
    }

    // Double check in MongoDB in case Redis failed
    const message = await SecretMessage.exists({
      uniqueId,
      isRead: false,
      expiresAt: { $gt: new Date() },
    });

    if (message) {
      return res.status(200).end();
    }

    res.status(404).end();
  } catch (error) {
    console.error("Error checking message existence:", error);
    res.status(500).end();
  }
});

module.exports = router;
