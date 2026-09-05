
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ========================================
// GENERATE JWT
// ========================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// ========================================
// SEND TOKEN COOKIE
// ========================================

const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,

    secure: process.env.NODE_ENV === "production",

    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",

    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

// ========================================
// SIGNUP
// ========================================

const signup = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
    } = req.body;

    // ------------------------------
    // Validate required fields
    // ------------------------------

    if (
      !name ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ------------------------------
    // Validate password
    // ------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ------------------------------
    // Clean values
    // ------------------------------

    const cleanName = name.trim();

    const cleanUsername = username
      .trim()
      .toLowerCase();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ------------------------------
    // Validate username
    // ------------------------------

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

    // ------------------------------
    // Check existing email
    // ------------------------------

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ------------------------------
    // Check existing username
    // ------------------------------

    const existingUsername = await User.findOne({
      username: cleanUsername,
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username is already taken",
      });
    }

    // ------------------------------
    // Hash password
    // ------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // ------------------------------
    // Create user
    // ------------------------------

    const user = await User.create({
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      bio: "",
      avatar: "",
    });

    // ------------------------------
    // Generate JWT
    // ------------------------------

    const token = generateToken(user._id);

    // ------------------------------
    // Send cookie
    // ------------------------------

    sendTokenCookie(res, token);

    // ------------------------------
    // Response
    // ------------------------------

    res.status(201).json({
      success: true,
      message: "Account created successfully",

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle duplicate fields
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Email or username is already registered",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ------------------------------
    // Validate fields
    // ------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ------------------------------
    // Clean email
    // ------------------------------

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ------------------------------
    // Find user
    // ------------------------------

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------
    // Compare password
    // ------------------------------

    const isPasswordCorrect =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ------------------------------
    // Generate JWT
    // ------------------------------

    const token = generateToken(user._id);

    // ------------------------------
    // Send cookie
    // ------------------------------

    sendTokenCookie(res, token);

    // ------------------------------
    // Response
    // ------------------------------

    res.status(200).json({
      success: true,
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// LOGOUT
// ========================================

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// ========================================
// GET CURRENT USER
// ========================================

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.userId
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};

