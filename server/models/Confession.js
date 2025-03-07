const mongoose = require("mongoose");

const ConfessionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Anonymous",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: String,
        author: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Confession", ConfessionSchema);
