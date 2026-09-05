const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// ==========================
// DATABASE
// ==========================

connectDB();

// ==========================
// MIDDLEWARE
// ==========================

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

// ==========================
// HEALTH CHECK
// ==========================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

// ==========================
// AUTH ROUTES
// ==========================

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ==========================
// SERVER
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});