const Task = require("../models/taskModel");
const User = require("../models/userModel");
const logger = require("../utils/logger");
const mongoose = require("mongoose");

async function createTask(userId, taskData) {
  try {
    const task = await Task.create({ ...taskData, createdBy: userId });
    return task;
  } catch (error) {
    logger.error("Error creating task:", error);
    throw createError(500, "Failed to create task");
  }
}

async function updateTask(userId, taskId, updates) {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    updates,
    { new: true }
  ).orFail(() => {
    throw createError(404, "Task not found or unauthorized");
  });
  return task;
}

async function deleteTask(userId, taskId) {
  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    { deleted: true },
    { new: true }
  ).orFail(() => {
    throw createError(404, "Task not found or unauthorized");
  });

  return { message: "Task deleted successfully", task };
}

async function assignTask(userId, taskId, assignedUserId) {
  const userExists = await User.exists({ username: assignedUserId });
  if (!userExists) {
    throw createError(404, "Assigned user not found");
  }

  const task = await Task.findOneAndUpdate(
    { _id: taskId, createdBy: userId },
    { assignedTo: assignedUserId },
    { new: true } // Return updated task
  ).orFail(() => {
    throw createError(404, "Task not found or unauthorized");
  });

  if (!task) {
    throw createError(404, "Task not found or unauthorized to assign");
  }

  return task;
}

async function getTasks(queryParams) {
  try {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;
    const filters = buildFilters(queryParams);

    const tasks = await Task.find(filters).skip(skip).limit(limit).lean();
    const totalTasks = await Task.countDocuments(filters);

    return {
      tasks,
      total: totalTasks,
      page,
      limit,
      totalPages: Math.ceil(totalTasks / limit),
    };
  } catch (error) {
    logger.error("Error retrieving tasks:", error);
    throw createError(500, "Failed to retrieve tasks");
  }
}

// Helper Functions
function buildFilters({ includeDeleted, status, priority }) {
  const filters = {};
  if (includeDeleted !== "true") filters.deleted = { $ne: true };
  if (status) filters.status = status;
  if (priority) filters.priority = priority;
  return filters;
}

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
};
