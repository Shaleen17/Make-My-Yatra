const express = require("express");

const {
  createOrder,
  getOrdersByUser,
} = require("../controllers/order.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const {
  createOrderSchema,
  getOrdersByUserSchema,
} = require("../validators/order.validator");

const router = express.Router();

router.post("/", validateRequest(createOrderSchema), asyncHandler(createOrder));
router.get(
  "/:name",
  validateRequest(getOrdersByUserSchema),
  asyncHandler(getOrdersByUser)
);

module.exports = router;
