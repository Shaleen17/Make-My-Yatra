const express = require("express");
const {
  register,
  login,
  me,
  sendOtp,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
} = require("../controllers/auth.controller");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth.middleware");
const authRateLimiter = require("../middleware/authRateLimit.middleware");
const otpRateLimiter = require("../middleware/otpRateLimit.middleware");
const validateRequest = require("../middleware/validateRequest");
const {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshSchema,
} = require("../validators/auth.validator");

const router = express.Router();

router.post(
  "/register",
  authRateLimiter,
  validateRequest(registerSchema),
  asyncHandler(register)
);
router.post(
  "/signup",
  authRateLimiter,
  validateRequest(registerSchema),
  asyncHandler(register)
);
router.post(
  "/login",
  authRateLimiter,
  validateRequest(loginSchema),
  asyncHandler(login)
);
router.get("/me", requireAuth, asyncHandler(me));

router.post(
  "/send-otp",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(sendOtpSchema),
  asyncHandler(sendOtp)
);
router.post(
  "/verify-otp",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(verifyOtpSchema),
  asyncHandler(verifyOtp)
);
router.post(
  "/resend-otp",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(resendOtpSchema),
  asyncHandler(resendOtp)
);
router.post(
  "/forgot-password",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(forgotPasswordSchema),
  asyncHandler(forgotPassword)
);
router.post(
  "/reset-password",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(resetPasswordSchema),
  asyncHandler(resetPassword)
);

// Backward-compatible aliases used by the current React auth flow.
router.post(
  "/sendOTP",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(sendOtpSchema),
  asyncHandler(sendOtp)
);
router.post(
  "/verifyOTP",
  authRateLimiter,
  otpRateLimiter,
  validateRequest(verifyOtpSchema),
  asyncHandler(verifyOtp)
);
router.post("/refresh", validateRequest(refreshSchema), asyncHandler(refresh));
router.get("/logout", asyncHandler(logout));
router.post("/logout", asyncHandler(logout));

module.exports = router;
