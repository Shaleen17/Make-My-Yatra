const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { searchFlightOffers } = require("../controllers/flight.controller");

const router = express.Router();

router.get("/search", asyncHandler(searchFlightOffers));

module.exports = router;
