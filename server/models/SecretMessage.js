const mongoose = require("mongoose");
const crypto = require("crypto");

const SecretMessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(32).toString("hex"),
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SecretMessage", SecretMessageSchema);
