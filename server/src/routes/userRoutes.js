const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes
router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateMyProfile);

// Public route
router.get("/:username", getPublicProfile);

module.exports = router;