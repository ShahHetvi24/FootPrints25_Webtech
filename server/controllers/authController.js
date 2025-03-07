const User = require("../models/User");
const { nanoid } = require("nanoid");

// Create anonymous user
exports.createAnonymousUser = async (req, res) => {
  try {
    const { username, avatar } = req.body;

    // Generate unique username if not provided
    const displayName = username || `Anonymous-${nanoid(6)}`;

    // Create anonymous user
    const user = new User({
      displayName,
      avatar:
        avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${nanoid(10)}`,
      isAnonymous: true,
    });

    await user.save();

    // Log in the user
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login error", error: err });
      }
      return res.status(201).json({ user });
    });
  } catch (error) {
    console.error("Create anonymous user error:", error);
    res
      .status(500)
      .json({ message: "Error creating anonymous user", error: error.message });
  }
};

// Get current user
exports.getCurrentUser = (req, res) => {
  if (req.user) {
    return res.json({ user: req.user });
  }
  res.status(401).json({ message: "Not logged in" });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, avatar } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const updates = {};
    if (displayName) updates.displayName = displayName;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });

    res.json({ user });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout error", error: err });
    }
    res.json({ message: "Logged out successfully" });
  });
};
