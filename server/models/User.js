const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: function () {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${this._id}`;
      },
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);