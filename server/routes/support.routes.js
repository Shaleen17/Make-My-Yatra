const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { receiveSupportMessage } = require("../controllers/support.controller");

const router = express.Router();

router.post("/messages", asyncHandler(receiveSupportMessage));

module.exports = router;
