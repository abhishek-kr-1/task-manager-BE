const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");
const config = require("../config");

async function signup(username, password) {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return { status: 400, data: { message: "User already exists" } };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return { status: 201, data: { message: "User created successfully" } };
  } catch (error) {
    logger.error("Signup error:", error);
    throw new Error("Error creating user");
  }
}

async function login(username, password) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return {
        status: 400,
        data: { success: false, message: "Invalid credentials" },
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: 400,
        data: { success: false, message: "Invalid credentials" },
      };
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: `${config.jwtExpirationDays}d`,
    });

    // Parse expiration from config
    const expiresInMs = config.jwtExpirationDays * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMs);

    return {
      status: 200,
      data: {
        token,
        expiresAt,
        user: {
          id: user._id,
          name: user.username,
        },
      },
    };
  } catch (error) {
    logger.error("Login error:", error);
    throw new Error("Error logging in");
  }
}

module.exports = {
  signup,
  login,
};
