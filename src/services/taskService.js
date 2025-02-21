const Task = require("../models/taskModel");
const User = require("../models/userModel");
const logger = require("../utils/logger");

async function createTask(userId, taskData) {
  try {
    const { title, description, status, priority } = taskData;

    const task = new Task({
      title,
      description,
      status,
      priority,
      createdBy: userId,
    });

    await task.save();
    return {
      status: 201,
      data: { message: "Task created successfully", task },
    };
  } catch (error) {
    logger.error("Error creating task:", error);
    throw new Error("Error creating task");
  }
}

async function updateTask(userId, taskId, updates) {
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return { status: 404, data: { message: "Task not found" } };
    }

    if (task.createdBy.toString() !== userId) {
      return {
        status: 403,
        data: { message: "Not authorized to update this task" },
      };
    }

    Object.assign(task, updates);
    await task.save();

    return {
      status: 200,
      data: { message: "Task updated successfully", task },
    };
  } catch (error) {
    logger.error("Error updating task:", error);
    throw new Error("Error updating task");
  }
}

async function deleteTask(userId, taskId) {
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return { status: 404, data: { message: "Task not found" } };
    }

    if (task.createdBy.toString() !== userId) {
      return {
        status: 403,
        data: { message: "Not authorized to delete this task" },
      };
    }

    task.deleted = true;
    await task.save();

    return {
      status: 200,
      data: { message: "Task deleted successfully", task },
    };
  } catch (error) {
    logger.error("Error deleting task:", error);
    throw new Error("Error deleting task");
  }
}

async function assignTask(userId, taskId, assignedUserId) {
  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return { status: 404, data: { message: "Task not found" } };
    }

    if (task.createdBy.toString() !== userId) {
      return {
        status: 403,
        data: { message: "Not authorized to assign this task" },
      };
    }

    const user = await User.findById(assignedUserId);
    if (!user) {
      return { status: 404, data: { message: "User not found" } };
    }

    task.assignedTo = assignedUserId;
    await task.save();

    return {
      status: 200,
      data: { message: "Task assigned successfully", task },
    };
  } catch (error) {
    logger.error("Error assigning task:", error);
    throw new Error("Error assigning task");
  }
}

// TODO: Can provide filter based on userId
async function getTasks(queryParams) {
  try {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const includeDeleted = queryParams.includeDeleted == "true";
    const { status, priority } = queryParams;
    const skip = (page - 1) * limit;

    const query = {};
    if (!includeDeleted) query.deleted = { $ne: true };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query).skip(skip).limit(limit);
    const totalTasks = await Task.countDocuments(query);

    return {
      status: 200,
      data: {
        message: "Tasks retrieved successfully",
        tasks,
        total: totalTasks,
        page,
        limit,
        totalPages: Math.ceil(totalTasks / limit),
      },
    };
  } catch (error) {
    logger.error("Error retrieving tasks:", error);
    throw new Error("Error retrieving tasks");
  }
}

module.exports = {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
};
