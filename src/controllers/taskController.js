const Task = require("../models/taskModel");
const User = require("../models/userModel");
const logger = require("../utils/logger");

async function createTask(req, res) {
  try {
    const { title, description, status, priority } = req.body;
    const task = new Task({
      title,
      description,
      status,
      priority,
      createdBy: req.user.id,
    });
    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    logger.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    Object.assign(task, updates);
    await task.save();
    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    task.deleted = true;
    await task.save();
    res.status(200).json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
}

// Assign a task to another user
async function assignTask(req, res) {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Assuming userId is sent in the request body
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to assign this task" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    task.assignedTo = userId; // Assuming 'assignedTo' is a field in the Task model
    await task.save();
    res.status(200).json({ message: "Task assigned successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Error assigning task", error });
  }
}

// Get paginated tasks with filtering
async function getTasks(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const includeDeleted = req.query.includeDeleted == "true";
    const { status, priority } = req.query;
    const skip = (page - 1) * limit;

    const query = {};

    if (!includeDeleted) {
      query.deleted = { $ne: true };
    }

    if (status) {
      query.status = status;
    }
    if (priority) {
      query.priority = priority;
    }

    const tasks = await Task.find(query).skip(skip).limit(limit);

    const totalTasks = await Task.countDocuments(query);
    res.status(200).json({
      message: "Tasks retrieved successfully",
      tasks,
      total: totalTasks,
      page,
      limit,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    logger.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error });
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
};
