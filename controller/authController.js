const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsyncError = require("../utils/catchAsyncError");
const User = require("../model/userModel");

exports.register = catchAsyncError(async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

   //if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    next(error);
  }
});

// ✅ Login user & issue JWT in HTTP-only cookie
exports.login = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ success: true, message: "Login successful", token,user });
  } catch (error) {
    next(error);
  }
});

// ✅ Logout user (Clear JWT cookie)
exports.logout = catchAsyncError(async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    next(error);
  }
});

//get all users

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error); // Pass error to Express error handler
  }
});

// ✅ Get user by ID (Admin or the user themselves)
exports.getUserById = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user.id !== user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});