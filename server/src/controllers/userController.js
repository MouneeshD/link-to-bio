const User = require("../models/User");

// ========================================
// GET MY PROFILE
// ========================================

const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// UPDATE MY PROFILE
// ========================================

const updateMyProfile = async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validate name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      if (name.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 50 characters",
        });
      }

      user.name = name.trim();
    }

    // Validate username
    if (username !== undefined) {
      const cleanUsername = username
        .trim()
        .toLowerCase();

      if (!/^[a-z0-9_]+$/.test(cleanUsername)) {
        return res.status(400).json({
          success: false,
          message:
            "Username can only contain letters, numbers and underscores",
        });
      }

      if (
        cleanUsername.length < 3 ||
        cleanUsername.length > 30
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Username must be between 3 and 30 characters",
        });
      }

      // Check whether username belongs to another user
      const existingUser = await User.findOne({
        username: cleanUsername,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username is already taken",
        });
      }

      user.username = cleanUsername;
    }

    // Validate bio
    if (bio !== undefined) {
      if (bio.length > 160) {
        return res.status(400).json({
          success: false,
          message: "Bio cannot exceed 160 characters",
        });
      }

      user.bio = bio.trim();
    }

    // Avatar URL
    if (avatar !== undefined) {
      user.avatar = avatar.trim();
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET PUBLIC PROFILE
// ========================================

const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("-password -email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get public profile error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
};