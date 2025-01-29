// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// Middleware for JWT validation
export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ error: true, success: false, message: "Unauthorized" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ error: true, success: false, message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};

// Route to register a new user
export const registerUser = async (req, res) => {
  const userPayload = req.body; // data sent by user
  if (
    !userPayload.id ||
    !userPayload.name ||
    !userPayload.surname ||
    !userPayload.email ||
    !userPayload.password ||
    !userPayload.role
  ) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "please provide all fields",
    });
  }
  try {
    // Check if the email already exists
    const lowerCaseEmail = req.body?.email?.toLowerCase();
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Email already exists, please sign in",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
      id: req.body.id,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });

    await newUser.save();
    res.status(201).json({
      error: false,
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, success: false, message: "Server Error" });
  }
};

// Route to authenticate and log in a user
export const loginUser = async (req, res) => {
  const userPayload = req.body; // data sent by user
  if (!userPayload.email || !userPayload.password) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "please provide all fields",
    });
  }
  try {
    const lowerCaseEmail = req.body?.email?.toLowerCase();
    // Check if the email exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res
        .status(401)
        .json({ error: true, success: false, message: "Invalid email" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: true, success: false, message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user.id, role: user.role },
      "secret"
    );
    res.status(200).json({ error: false, success: true, message: token });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, success: false, message: "Server Error" });
  }
};

export const changePassword = async (req, res) => {
  const userPayload = req.body; // data sent by user
  if (!userPayload.email || !userPayload.password) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "please provide all fields",
    });
  }
  try {
    const lowerCaseEmail = req.body?.email?.toLowerCase();
    // Check if the email exists
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res
        .status(401)
        .json({ error: true, success: false, message: "Invalid email" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Find user by email and update their password
    const updatedUser = await User.findOneAndUpdate(
      { email: lowerCaseEmail }, // Find user by email
      { password: hashedPassword }, // Update password
      { new: true, runValidators: true } // Return updated document and validate schema
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "User not found with the provided email.",
      });
    }

    return res.status(201).json({
      error: false,
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, success: false, message: "Server Error" });
  }
};

// Protected route to get user details
// app.get("/api/user", verifyToken,
export const getAdminProduct = async (req, res) => {
  const lowerCaseEmail = req.user?.email?.toLowerCase();
  try {
    // Fetch user details using decoded token
    const user = await User.findOne({ email: lowerCaseEmail });
    const products = await Product.find();
    if (!user) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(404)
        .json({ error: true, success: false, message: "Unauthorized" });
    }
    res.status(200).json({ error: false, success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, success: false, message: "Internal server error" });
  }
};

// // Default route
// app.get("/", (req, res) => {
//   res.send("Welcome to my User Registration and Login API!");
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
