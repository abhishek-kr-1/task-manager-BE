const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const rateLimiter = require("./middlewares/rateLimiter");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes");
const mongoSanitize = require("express-mongo-sanitize");
const swaggerDocument = require("../swagger.json");

const app = express();

app.use(helmet()); // Adds security headers
app.use(cors()); // // Allows all origins for now (Define specific domains to access)
app.use(express.json());
app.use(rateLimiter);
app.use(mongoSanitize()); // Prevent operator injection.

// Test route
app.get("/v1/test", (req, res) => {
  res.json({ message: "This is a test route" });
});

// Routes
app.use("/v1", routes);

// API Doc
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
