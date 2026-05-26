const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const requestRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  skip: () => env.isTest,
});

module.exports = requestRateLimiter;
