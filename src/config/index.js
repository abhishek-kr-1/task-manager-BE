require("dotenv").config();

const requiredEnvVars = [
  "PORT",
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRATION_DAYS",
  "RATE_LIMIT_WINDOW_MS",
  "RATE_LIMIT_MAX_REQUESTS",
];

// Check if all required environment variables are set
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Missing required environment variable ${envVar}`);
    process.exit(1);
  }
});

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationDays: parseInt(process.env.JWT_EXPIRATION_DAYS),
  rateLimitWindowMs:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  rateLimitMaxRequests:
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};
