const express = require("express");

const {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
} = require("../controllers/linkController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all my links
router.get("/", protect, getMyLinks);

// Create link
router.post("/", protect, createLink);

// Reorder links
router.put("/reorder", protect, reorderLinks);

// Update link
router.put("/:id", protect, updateLink);

// Delete link
router.delete("/:id", protect, deleteLink);

module.exports = router;