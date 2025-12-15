const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getMe } = require("../controllers/userController"); // include getMe
const requireAuth = require("../middleware/requireAuth");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// protected route to get authenticated user info
router.get("/me", requireAuth, getMe);

module.exports = router;
