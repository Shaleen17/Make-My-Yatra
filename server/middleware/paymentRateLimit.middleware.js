const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const paymentRateLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.paymentRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many payment requests. Please try again later.",
    msg: "Too many payment requests. Please try again later.",
  },
  skip: () => env.isTest,
});

module.exports = paymentRateLimiter;
