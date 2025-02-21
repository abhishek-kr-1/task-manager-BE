const userService = require("../services/userService");

async function listUsers(req, res) {
  try {
    const result = await userService.listUsers(req.query);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

async function getUserById(req, res) {
  try {
    const result = await userService.getUserById(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

module.exports = {
  listUsers,
  getUserById,
};
