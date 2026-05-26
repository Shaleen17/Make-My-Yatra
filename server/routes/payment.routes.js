const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed,
  handleRazorpayWebhook,
} = require("../controllers/payment.controller");
const asyncHandler = require("../middleware/asyncHandler");
const paymentRateLimiter = require("../middleware/paymentRateLimit.middleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createPaymentOrderSchema,
  verifyPaymentSchema,
  paymentFailureSchema,
} = require("../validators/payment.validator");

const router = express.Router();

router.post(
  "/",
  paymentRateLimiter,
  validateRequest(createPaymentOrderSchema),
  asyncHandler(createPaymentOrder)
);
router.post(
  "/create-order",
  paymentRateLimiter,
  validateRequest(createPaymentOrderSchema),
  asyncHandler(createPaymentOrder)
);
router.post(
  "/verify",
  paymentRateLimiter,
  validateRequest(verifyPaymentSchema),
  asyncHandler(verifyPayment)
);
router.post(
  "/failure",
  paymentRateLimiter,
  validateRequest(paymentFailureSchema),
  asyncHandler(markPaymentFailed)
);
router.post("/webhook", asyncHandler(handleRazorpayWebhook));

module.exports = router;
