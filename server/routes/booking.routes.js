const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBookingById,
} = require("../controllers/booking.controller");
const asyncHandler = require("../middleware/asyncHandler");
const validateRequest = require("../middleware/validateRequest");
const {
  createBookingSchema,
  myBookingsSchema,
  bookingIdParamSchema,
  cancelBookingSchema,
} = require("../validators/booking.validator");

const router = express.Router();

router.post(
  "/create",
  validateRequest(createBookingSchema),
  asyncHandler(createBooking)
);
router.get(
  "/my-bookings",
  validateRequest(myBookingsSchema),
  asyncHandler(getMyBookings)
);
router.get(
  "/:id",
  validateRequest(bookingIdParamSchema),
  asyncHandler(getBookingById)
);
router.post(
  "/:id/cancel",
  validateRequest(cancelBookingSchema),
  asyncHandler(cancelBookingById)
);

module.exports = router;
