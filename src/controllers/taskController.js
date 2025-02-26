const taskService = require("../services/taskService");
const { validationResult } = require("express-validator");

async function createTask(req, res) {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const task = await taskService.createTask(req.user.username, req.body);
    return res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    return handleError(res, error);
  }
}

async function updateTask(req, res) {
  try {
    const task = await taskService.updateTask(
      req.user.username,
      req.params.id,
      req.body
    );
    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    return handleError(res, error);
  }
}

async function deleteTask(req, res) {
  try {
    await taskService.deleteTask(req.user.username, req.params.id);
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    return handleError(res, error);
  }
}

async function assignTask(req, res) {
  try {
    const task = await taskService.assignTask(
      req.user.username,
      req.params.id,  
      req.body.userId
    );
    return res
      .status(200)
      .json({ message: "Task assigned successfully", task });
  } catch (error) {
    return handleError(res, error);
  }
}

async function getTasks(req, res) {
  try {
    const result = await taskService.getTasks(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return handleError(res, error);
  }
}

// Centralized error handling
function handleError(res, error) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  console.error(error);
  return res.status(500).json({ message: "Internal Server Error" });
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
};
