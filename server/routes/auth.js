const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const User = require("../models/User");

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

router.get("/getProfile", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      loggedIn: true,
      username: req.user.displayName || req.user.username,
    });
  }
  return res.status(401).json({ loggedIn: false });
});


// Anonymous user creation route
router.post("/anonymous", authController.createAnonymousUser);

// Get current user
router.get("/user", authController.getCurrentUser);

// Update user profile
router.put("/profile", authController.updateProfile);

// Logout route
router.post("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      }

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        status: 200,
        message: "Logged out successfully",
        data: null,
      });
    });
  });
});

module.exports = router;
