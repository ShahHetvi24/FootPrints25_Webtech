const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      userId: String,
      username: String,
      avatar: String,
    },
  },
  { timestamps: true }
);

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    shareableLink: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(8).toString("hex"),
    },
    allowedUsers: {
      type: [String],
      default: [],
    },
    messageExpiryHours: {
      type: Number,
      default: 24,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
