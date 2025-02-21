const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
} = require("../controllers/taskController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

// Task CRUD Operations
router.post("/", authenticate, createTask);
router.put("/:id", authenticate, updateTask);
router.delete("/:id", authenticate, deleteTask);

// Task Assignment
router.post("/:id/assign", authenticate, assignTask);

// Filtering & Pagination
router.get("/", authenticate, getTasks);

module.exports = router;
