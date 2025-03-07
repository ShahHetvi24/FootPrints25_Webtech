const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

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

// Anonymous user creation route
router.post("/anonymous", authController.createAnonymousUser);

// Get current user
router.get("/user", authController.getCurrentUser);

// Update user profile
router.put("/profile", authController.updateProfile);

// Logout route
router.get("/logout", authController.logout);

module.exports = router;
