const validator = require('validator'); // updated
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
  } = req.body;

  try {
    // validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status
    ) {
      throw new Error("All fields must be filled");
    }

    // validate email using validator // updated
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // validate password strength using validator // updated
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ error: "Password is too weak" });
    }

    // validate phone number (10+ digits)
    if (!/^\d{10,}$/.test(phone_number)) {
      throw new Error("Phone number must contain at least 10 digits");
    }

    // validate enums
    if (!["Male", "Female", "Other"].includes(gender)) {
      throw new Error("Invalid gender value");
    }

    if (!["Active", "Inactive", "Suspended"].includes(membership_status)) {
      throw new Error("Invalid membership status");
    }

    // create user
    const user = await User.signup(
      name,
      email,
      password,
      phone_number,
      gender,
      date_of_birth,
      membership_status
    );

    // create a token
    const token = generateToken(user._id);

    res.status(201).json({
      user, // full user object including all fields // updated
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    // create a token
    const token = generateToken(user._id);

    res.status(200).json({
      user, // return full user object // updated
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user); // req.user comes from requireAuth // updated
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
