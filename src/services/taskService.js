const Task = require('../models/taskModel');
const User = require('../models/userModel');

// Create a new task
const createTask = async (taskData) => {
    const task = new Task(taskData);
    return await task.save();
};

// Update a task
const updateTask = async (taskId, updateData) => {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
};

// Soft delete a task
const softDeleteTask = async (taskId) => {
    return await Task.findByIdAndUpdate(taskId, { deleted: true }, { new: true });
};

// Assign a task to a user
const assignTask = async (taskId, userId) => {
    const task = await Task.findById(taskId);
    if (!task) {
        throw new Error('Task not found');
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (task.creator.toString() !== userId) {
        throw new Error('Only the task creator can assign this task');
    }
    task.assignedTo = userId;
    return await task.save();
};

// Get paginated tasks with filtering
const getTasks = async (page, limit, filters) => {
    const query = {};
    if (filters.status) {
        query.status = filters.status;
    }
    if (filters.priority) {
        query.priority = filters.priority;
    }
    const tasks = await Task.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
    const totalTasks = await Task.countDocuments(query);
    return { tasks, totalTasks };
};

module.exports = {
    createTask,
    updateTask,
    softDeleteTask,
    assignTask,
    getTasks,
};