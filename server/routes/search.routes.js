const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const {
  searchAccommodations,
  searchDestinations,
  getAvailabilitySnapshot,
} = require("../controllers/search.controller");

const router = express.Router();

router.get("/destinations", asyncHandler(searchDestinations));
router.get("/accommodations", asyncHandler(searchAccommodations));
router.get("/availability", asyncHandler(getAvailabilitySnapshot));

module.exports = router;
