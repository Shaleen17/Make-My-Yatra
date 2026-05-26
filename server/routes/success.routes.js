const express = require("express");

const { createSuccess } = require("../controllers/success.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const { createSuccessSchema } = require("../validators/success.validator");

const router = express.Router();

router.post(
  "/",
  validateRequest(createSuccessSchema),
  asyncHandler(createSuccess)
);

module.exports = router;
