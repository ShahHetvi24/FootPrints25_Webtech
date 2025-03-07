const express = require("express");
const router = express.Router();
const Confession = require("../models/Confession");
const { isAuthenticated } = require("../middleware/auth");

// Get all public confessions (paginated)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get confessions with pagination
    const confessions = await Confession.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");

    // Count total documents for pagination
    const total = await Confession.countDocuments();

    res.status(200).json({
      success: true,
      data: confessions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching confessions:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch confessions" });
  }
});

// Create a new confession
router.post("/", async (req, res) => {
  try {
    const { content, anonymous, tags } = req.body;

    if (!content) {
      return res
        .status(400)
        .json({ success: false, message: "Content is required" });
    }

    const newConfession = new Confession({
      content,
      anonymous: anonymous !== false,
      userId: req.isAuthenticated() && !anonymous ? req.user._id : null,
      tags: tags || [],
    });

    await newConfession.save();

    res.status(201).json({
      success: true,
      message: "Confession created successfully",
      data: newConfession,
    });
  } catch (error) {
    console.error("Error creating confession:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create confession" });
  }
});

// Like a confession
router.post("/:id/like", async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res
        .status(404)
        .json({ success: false, message: "Confession not found" });
    }

    confession.likes += 1;
    await confession.save();

    res.status(200).json({
      success: true,
      message: "Confession liked",
      likes: confession.likes,
    });
  } catch (error) {
    console.error("Error liking confession:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to like confession" });
  }
});

// Get confession by ID
router.get("/:id", async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id).select("-__v");

    if (!confession) {
      return res
        .status(404)
        .json({ success: false, message: "Confession not found" });
    }

    res.status(200).json({
      success: true,
      data: confession,
    });
  } catch (error) {
    console.error("Error fetching confession:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch confession" });
  }
});

// Delete a confession (only the creator can delete)
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res
        .status(404)
        .json({ success: false, message: "Confession not found" });
    }

    // Check if user is the creator
    if (
      confession.userId &&
      confession.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this confession",
      });
    }

    await confession.deleteOne();

    res.status(200).json({
      success: true,
      message: "Confession deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting confession:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete confession" });
  }
});

// Get confessions by tag
router.get("/tags/:tag", async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`Searching for tag: ${tag}`);

    const confessions = await Confession.find({ tags: { $in: [tag] } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v");


    const total = await Confession.countDocuments({ tags: { $in: [tag] } });

    res.status(200).json({
      success: true,
      data: confessions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching confessions by tag:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch confessions" });
  }
});


module.exports = router;
