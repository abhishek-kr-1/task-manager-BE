const express = require("express");
const {
  createTask,
  updateTask,
  deleteTask,
  assignTask,
  getTasks,
} = require("../controllers/taskController");
const { authenticate } = require("../middlewares/authMiddleware");
const { validateDbObjectId } = require("../middlewares/validationMiddleware");

const router = express.Router();

const routesWithId = [
  {
    method: "put",
    path: "/:id",
    handler: updateTask,
    params: ["id"],
  },
  {
    method: "delete",
    path: "/:id",
    handler: deleteTask,
    params: ["id"],
  },
  {
    method: "post",
    path: "/:id/assign",
    handler: assignTask,
    params: ["id"],
  },
];

// Apply validation dynamically
routesWithId.forEach(({ method, path, handler, params }) => {
  router[method](path, authenticate, validateDbObjectId(params), handler);
});

// Other routes
router.post("/", authenticate, createTask);
router.get("/", authenticate, getTasks);

module.exports = router;
