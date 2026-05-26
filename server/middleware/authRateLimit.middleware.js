const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const authRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.authRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    msg: "Too many authentication attempts. Please try again later.",
  },
  skip: () => env.isTest,
});

module.exports = authRateLimiter;
