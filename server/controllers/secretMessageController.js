const SecretMessage = require("../models/SecretMessage");
const crypto = require("crypto");

// Create a secret message
exports.createSecretMessage = async (req, res) => {
  try {
    const { content, expiryHours } = req.body;

    // Calculate expiry time (default to 24 hours if not specified)
    const expiresAt = new Date(
      Date.now() + (expiryHours || 24) * 60 * 60 * 1000
    );

    // Create token
    const token = crypto.randomBytes(32).toString("hex");

    const secretMessage = new SecretMessage({
      content,
      token,
      expiresAt,
      senderId: req.user ? req.user.id : null,
    });

    await secretMessage.save();

    // Create shareable link
    const shareableLink = `${process.env.FRONTEND_URL}/secret/${token}`;

    res.status(201).json({
      token,
      shareableLink,
      expiresAt,
    });
  } catch (error) {
    console.error("Create secret message error:", error);
    res
      .status(500)
      .json({ message: "Error creating secret message", error: error.message });
  }
};

// Read a secret message
exports.readSecretMessage = async (req, res) => {
  try {
    const { token } = req.params;

    const message = await SecretMessage.findOne({ token, isRead: false });

    if (!message) {
      return res
        .status(404)
        .json({ message: "Message not found or already read" });
    }

    // Check if message has expired
    if (message.expiresAt < new Date()) {
      await SecretMessage.deleteOne({ _id: message._id });
      return res.status(410).json({ message: "This message has expired" });
    }

    // Mark as read and delete
    message.isRead = true;
    await message.save();

    // Schedule deletion (after sending response)
    setTimeout(async () => {
      try {
        await SecretMessage.deleteOne({ _id: message._id });
        console.log(`Message ${token} deleted after reading`);
      } catch (err) {
        console.error(`Error deleting message ${token}:`, err);
      }
    }, 5000);

    // Return message content
    res.json({
      content: message.content,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error("Read secret message error:", error);
    res
      .status(500)
      .json({ message: "Error reading secret message", error: error.message });
  }
};
