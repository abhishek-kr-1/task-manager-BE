const express = require("express");
const { listUsers } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authenticate, listUsers);

module.exports = router;
