const rateLimit = require("express-rate-limit");
const config = require("../config");

const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    status: 429,
    error: "Too many requests",
    message: "Too many requests from this IP, please try again later.",
  },
  headers: true,
});

module.exports = rateLimiter;
