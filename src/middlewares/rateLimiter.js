const rateLimit = require("express-rate-limit");
const config = require("../config");

const rateLimiter = rateLimit({
  windowMs: parseInt(config.rateLimitWindowMs, 10), // Ensure it's a number
  max: parseInt(config.rateLimitMaxRequests, 10), // Ensure it's a number
  message: "Too many requests from this IP, please try again later.",
});

module.exports = rateLimiter;
