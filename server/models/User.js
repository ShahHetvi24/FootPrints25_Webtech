const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: {
    type: String,
    sparse: true,
  },
  email: {
    type: String,
    sparse: true,
  },
  name: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;