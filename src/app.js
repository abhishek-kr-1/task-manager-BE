const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerDocument = require("../swagger.json");

const app = express();

app.use(helmet()); // Adds security headers
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(mongoSanitize()); // Prevent operator injection.

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
