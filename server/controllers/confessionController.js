const Confession = require("../models/Confession");

// Get all confessions
exports.getConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ confessions });
  } catch (error) {
    console.error("Get confessions error:", error);
    res
      .status(500)
      .json({ message: "Error fetching confessions", error: error.message });
  }
};

// Create a confession
exports.createConfession = async (req, res) => {
  try {
    const { content, isAnonymous } = req.body;

    const confession = new Confession({
      content,
      isAnonymous: isAnonymous !== false, // Default to true
      authorId: req.user ? req.user.id : null,
      author:
        isAnonymous !== false && req.user ? req.user.displayName : "Anonymous",
    });

    await confession.save();
    res.status(201).json({ confession });
  } catch (error) {
    console.error("Create confession error:", error);
    res
      .status(500)
      .json({ message: "Error creating confession", error: error.message });
  }
};

// Like a confession
exports.likeConfession = async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    confession.likes += 1;
    await confession.save();

    res.json({ likes: confession.likes });
  } catch (error) {
    console.error("Like confession error:", error);
    res
      .status(500)
      .json({ message: "Error liking confession", error: error.message });
  }
};

// Add comment to confession
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const author = req.user ? req.user.displayName : "Anonymous";

    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found" });
    }

    confession.comments.push({ text, author });
    await confession.save();

    res
      .status(201)
      .json({ comment: confession.comments[confession.comments.length - 1] });
  } catch (error) {
    console.error("Add comment error:", error);
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};
