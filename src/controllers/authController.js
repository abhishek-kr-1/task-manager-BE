const { validationResult } = require("express-validator");
const authService = require("../services/authService");

async function signup(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    const result = await authService.signup(username, password);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const result = await authService.login(username, password);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

module.exports = {
  signup,
  login,
};
