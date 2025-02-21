const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");
const config = require("../config");

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // TODO: Gracefully handle duplicate user creation
    logger.error("Server error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: `${config.jwtExpirationDays}d`,
    });

    // Parse expiration from config
    const expiresInMs = config.jwtExpirationDays * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs);

    res.json({
      token,
      expiresAt,
      user: {
        id: user._id,
        name: user.username,
      },
    });
  } catch (error) {
    logger.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  login,
  signup,
};
