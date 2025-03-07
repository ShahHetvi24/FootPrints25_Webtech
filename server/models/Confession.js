const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const confessionSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null, // Can be null for anonymous confessions
  },
  anonymous: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  tags: [String],
});

const Confession = mongoose.model("Confession", confessionSchema);
module.exports = Confession;
