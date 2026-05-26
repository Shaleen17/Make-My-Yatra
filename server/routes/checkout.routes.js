const express = require("express");

const {
  createCheckout,
  getCheckoutsByUser,
} = require("../controllers/checkout.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const {
  createCheckoutSchema,
  getCheckoutsByUserSchema,
} = require("../validators/checkout.validator");

const router = express.Router();

router.post(
  "/",
  validateRequest(createCheckoutSchema),
  asyncHandler(createCheckout)
);
router.get(
  "/:name",
  validateRequest(getCheckoutsByUserSchema),
  asyncHandler(getCheckoutsByUser)
);

module.exports = router;
