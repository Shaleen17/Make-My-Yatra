const { ZodError } = require("zod");
const { env } = require("../config/env");

const duplicateKeyMessage = (error) => {
  const field = Object.keys(error.keyValue || {})[0] || "record";
  return `${field} already exists.`;
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message || "Something went wrong.";
  let details = error.details;

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed.";
    details = error.issues;
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  if (error.code === 11000) {
    statusCode = 409;
    message = duplicateKeyMessage(error);
  }

  if (message.startsWith("CORS blocked origin")) {
    statusCode = 403;
    message = "Origin is not allowed by CORS policy.";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    msg: message,
    ...(details ? { details } : {}),
    ...(!env.isProduction && error.stack ? { stack: error.stack } : {}),
  });
};

module.exports = errorHandler;
