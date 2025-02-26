const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateSignup = [
  check("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

const validateLogin = [
  check("username").notEmpty().withMessage("Username is required"),
  check("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

/**
 * Middleware factory to validate MongoDB ObjectId for given route parameters.
 * @param {string[]} params - Array of parameter names to validate.
 */
const validateDbObjectId = (params) => (req, res, next) => {
  for (const param of params) {
    if (
      req.params[param] &&
      !mongoose.Types.ObjectId.isValid(req.params[param])
    ) {
      return res.status(400).json({ error: `${param} not found!` });
    }
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateDbObjectId,
};
