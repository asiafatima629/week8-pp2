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
    // validate required fields // updated
    if (
      !name ||
      !email ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status
    ) {
      throw new Error("All fields must be filled"); // updated
    }

    // validate phone number (10+ digits) // updated
    if (!/^\d{10,}$/.test(phone_number)) {
      throw new Error("Phone number must contain at least 10 digits"); // updated
    }

    // validate enums // updated
    if (!["Male", "Female", "Other"].includes(gender)) {
      throw new Error("Invalid gender value"); // updated
    }

    if (!["Active", "Inactive", "Suspended"].includes(membership_status)) {
      throw new Error("Invalid membership status"); // updated
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
