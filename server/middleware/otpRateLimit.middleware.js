const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again later.",
    msg: "Too many OTP requests. Please try again later.",
  },
  skip: () => env.isTest,
});

module.exports = otpRateLimiter;
