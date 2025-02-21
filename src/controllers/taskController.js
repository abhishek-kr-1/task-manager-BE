const taskService = require("../services/taskService");
const { validationResult } = require("express-validator");

async function createTask(req, res) {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await taskService.createTask(req.user.id, req.body);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

async function updateTask(req, res) {
  try {
    const result = await taskService.updateTask(
      req.user.id,
      req.params.id,
      req.body
    );
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

async function deleteTask(req, res) {
  try {
    const result = await taskService.deleteTask(req.user.id, req.params.id);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

async function assignTask(req, res) {
  try {
    const result = await taskService.assignTask(
      req.user.id,
      req.params.id,
      req.body.userId
    );
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

async function getTasks(req, res) {
  try {
    const result = await taskService.getTasks(req.query);
    return res.status(result.status).json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
};
