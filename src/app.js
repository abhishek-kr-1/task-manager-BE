const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const swaggerDocs = require("./config/swagger");

const app = express();

app.use(helmet()); // Adds security headers
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Test route
app.get("/v1/test", (req, res) => {
  res.json({ message: "This is a test route" });
});

// Routes
app.use("/v1/auth", authRoutes);
app.use("/v1/tasks", taskRoutes);
app.use("/v1/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

// Dynamically generate swagger file based on routes
swaggerDocs(app);

module.exports = app;
