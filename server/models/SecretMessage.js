const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const secretMessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true, // Index for faster deletion queries
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    default: null, // Optional password protection
  },
});

module.exports = mongoose.model("SecretMessage", secretMessageSchema);
