const express = require("express");
const router = express.Router();
const passport = require("passport");

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}`);
  }
);

// Get current user info
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, name, email, avatar } = req.user;
    return res.status(200).json({
      success: true,
      user: { id: _id, name, email, avatar },
    });
  }
  res.status(401).json({ success: false, message: "Not authenticated" });
});

// Logout route
router.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error logging out" });
    }
    res.status(200).json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;
