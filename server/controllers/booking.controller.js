const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const AppError = require("../utils/AppError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const {
  getIdempotencyKey,
  createPendingBooking,
  cancelBooking,
} = require("../services/booking.service");
const {
  emitBookingCreated,
  emitBookingStatusUpdated,
} = require("../socket");
const {
  sendBookingPendingEmail,
  sendCancellationEmail,
} = require("../services/bookingNotification.service");
const { writeAuditLog } = require("../services/audit.service");
const { bookingEvents } = require("../services/metrics.service");

const createBooking = async (req, res) => {
  const booking = await createPendingBooking({
    payload: req.body,
    idempotencyKey: getIdempotencyKey(req),
  });

  emitBookingCreated(booking);
  bookingEvents.inc({ event: "created" });
  await writeAuditLog({
    action: "booking_created",
    actorId: booking.user,
    targetType: "booking",
    targetId: String(booking._id),
    status: "success",
    req,
    metadata: {
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
    },
  });
  sendBookingPendingEmail(booking).catch((error) =>
    console.error("Booking pending email failed:", error.message)
  );

  return res.status(201).json({
    success: true,
    booking,
  });
};

const getMyBookings = async (req, res) => {
  const pagination = getPagination(req.query);
  const user = req.query?.user || req.query?.email;

  if (!user) {
    throw new AppError("User or email query is required.", 400);
  }

  const filter = {
    deletedAt: null,
    $or: [{ user }, { userEmail: String(user).toLowerCase() }],
  };
  const query = Booking.find(filter)
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const [bookings, total] = await Promise.all([
    query.exec(),
    Booking.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    data: bookings,
    pagination: buildPaginationMeta({ ...pagination, total }),
  });
};

const getBookingById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new AppError("Invalid booking id.", 400);
  }

  const booking = await Booking.findOne({
    _id: req.params.id,
    deletedAt: null,
  })
    .lean()
    .exec();

  if (!booking) {
    throw new AppError("Booking was not found.", 404);
  }

  return res.status(200).json({ success: true, booking });
};

const cancelBookingById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new AppError("Invalid booking id.", 400);
  }

  const booking = await cancelBooking({
    bookingId: req.params.id,
    reason: req.body?.reason || "Cancelled by user",
  });

  if (!booking) {
    throw new AppError("Booking cannot be cancelled.", 409);
  }

  emitBookingStatusUpdated(booking);
  bookingEvents.inc({ event: "cancelled" });
  await writeAuditLog({
    action: "booking_cancelled",
    actorId: req.user?.sub,
    actorRole: req.user?.role,
    targetType: "booking",
    targetId: req.params.id,
    status: "success",
    req,
    metadata: { reason: req.body?.reason },
  });
  sendCancellationEmail(booking).catch((error) =>
    console.error("Cancellation email failed:", error.message)
  );

  return res.status(200).json({ success: true, booking });
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBookingById,
};
