const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const Accommodation = require("../models/accommodation.model");
const Inventory = require("../models/inventory.model");
const OtpVerification = require("../models/otp.model");
const EmailLog = require("../models/emailLog.model");
const WebhookEvent = require("../models/webhookEvent.model");
const AuditLog = require("../models/auditLog.model");
const AppError = require("../utils/AppError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { invalidateCatalogCache } = require("../services/cache.service");
const { writeAuditLog } = require("../services/audit.service");
const {
  createSessionTokens,
  persistRefreshToken,
} = require("../services/auth.service");
const { refundPayment } = require("../services/razorpay.service");
const {
  emitBookingStatusUpdated,
  emitRoomAvailabilityUpdated,
  emitToAdmin,
} = require("../socket");

const adminRoles = ["admin", "superadmin", "support"];

const listWithPagination = async ({ model, filter = {}, query, sort = { createdAt: -1 } }) => {
  const pagination = getPagination(query);
  const [data, total] = await Promise.all([
    model
      .find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean()
      .exec(),
    model.countDocuments(filter),
  ]);

  return {
    data,
    pagination: buildPaginationMeta({ ...pagination, total }),
  };
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: String(email || "").toLowerCase(),
    deletedAt: null,
  })
    .select("+password")
    .exec();

  if (!user || !adminRoles.includes(user.role)) {
    await writeAuditLog({
      action: "admin_login",
      actorId: email,
      status: "failure",
      req,
    });
    throw new AppError("Invalid admin credentials.", 401);
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    await writeAuditLog({
      action: "admin_login",
      actorId: email,
      actorRole: user.role,
      status: "failure",
      req,
    });
    throw new AppError("Invalid admin credentials.", 401);
  }

  const tokens = createSessionTokens({ subject: user.email, role: user.role });
  await persistRefreshToken({
    refreshToken: tokens.refreshToken,
    refreshTokenId: tokens.refreshTokenId,
    subject: user.email,
    req,
  });
  await writeAuditLog({
    action: "admin_login",
    actorId: user.email,
    actorRole: user.role,
    status: "success",
    req,
  });

  return res.status(200).json({
    success: true,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
};

const roleCheck = (req, res) =>
  res.status(200).json({
    success: true,
    user: req.user,
  });

const getAllBookings = async (req, res) => {
  const result = await listWithPagination({
    model: Booking,
    query: req.query,
    filter: { deletedAt: null },
  });
  return res.json({ success: true, ...result });
};

const updateBookingStatus = async (req, res) => {
  const booking = await Booking.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    {
      $set: {
        bookingStatus: req.body.bookingStatus,
        paymentStatus: req.body.paymentStatus,
        "audit.updatedBy": req.user?.sub,
      },
    },
    { new: true }
  ).exec();

  if (!booking) throw new AppError("Booking was not found.", 404);

  emitBookingStatusUpdated(booking);
  emitToAdmin("admin_booking_updated", {
    bookingId: String(booking._id),
    bookingStatus: booking.bookingStatus,
    paymentStatus: booking.paymentStatus,
  });
  await writeAuditLog({
    action: "admin_update_booking_status",
    actorId: req.user?.sub,
    actorRole: req.user?.role,
    targetType: "booking",
    targetId: req.params.id,
    status: "success",
    req,
    metadata: req.body,
  });

  return res.json({ success: true, booking });
};

const upsertAccommodation = async (req, res) => {
  const accommodation = await Accommodation.findOneAndUpdate(
    { slug: req.body.slug },
    { $set: req.body },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  await invalidateCatalogCache();
  await writeAuditLog({
    action: "admin_upsert_accommodation",
    actorId: req.user?.sub,
    actorRole: req.user?.role,
    targetType: "accommodation",
    targetId: accommodation.slug,
    status: "success",
    req,
  });

  return res.status(200).json({ success: true, accommodation });
};

const listAccommodations = async (req, res) => {
  const result = await listWithPagination({
    model: Accommodation,
    query: req.query,
    filter: { deletedAt: null },
    sort: { name: 1 },
  });
  return res.json({ success: true, ...result });
};

const upsertInventory = async (req, res) => {
  const inventory = await Inventory.findOneAndUpdate(
    {
      accommodationSlug: req.body.accommodationSlug,
      roomTypeId: req.body.roomTypeId,
      date: new Date(req.body.date),
    },
    {
      $set: {
        totalUnits: req.body.totalUnits,
        reservedUnits: req.body.reservedUnits || 0,
        soldUnits: req.body.soldUnits || 0,
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).exec();

  await invalidateCatalogCache();
  emitRoomAvailabilityUpdated({
    accommodationSlug: inventory.accommodationSlug,
    roomTypeId: inventory.roomTypeId,
    date: inventory.date,
  });
  await writeAuditLog({
    action: "admin_upsert_inventory",
    actorId: req.user?.sub,
    actorRole: req.user?.role,
    targetType: "inventory",
    targetId: String(inventory._id),
    status: "success",
    req,
  });

  return res.json({ success: true, inventory });
};

const listPayments = async (req, res) => {
  const result = await listWithPagination({
    model: Payment,
    query: req.query,
    filter: { deletedAt: null },
  });
  return res.json({ success: true, ...result });
};

const requestRefund = async (req, res) => {
  const payment = await Payment.findById(req.params.id).exec();
  if (!payment?.razorpayDetails?.paymentId) {
    throw new AppError("Paid Razorpay payment was not found.", 404);
  }

  const refund = await refundPayment({
    paymentId: payment.razorpayDetails.paymentId,
    amount: req.body.amount,
  });
  payment.status = "refunded";
  await payment.save();
  await writeAuditLog({
    action: "admin_refund_payment",
    actorId: req.user?.sub,
    actorRole: req.user?.role,
    targetType: "payment",
    targetId: req.params.id,
    status: "success",
    req,
    metadata: { refundId: refund.id },
  });

  return res.json({ success: true, refund, payment });
};

const listUsers = async (req, res) => {
  const result = await listWithPagination({
    model: User,
    query: req.query,
    filter: { deletedAt: null },
    sort: { createdAt: -1 },
  });
  return res.json({ success: true, ...result });
};

const listOtpLogs = async (req, res) => {
  const result = await listWithPagination({
    model: OtpVerification,
    query: req.query,
    filter: {},
  });
  return res.json({ success: true, ...result });
};

const listEmailLogs = async (req, res) => {
  const result = await listWithPagination({
    model: EmailLog,
    query: req.query,
    filter: {},
  });
  return res.json({ success: true, ...result });
};

const listWebhookLogs = async (req, res) => {
  const result = await listWithPagination({
    model: WebhookEvent,
    query: req.query,
    filter: {},
  });
  return res.json({ success: true, ...result });
};

const listAuditLogs = async (req, res) => {
  const result = await listWithPagination({
    model: AuditLog,
    query: req.query,
    filter: {},
  });
  return res.json({ success: true, ...result });
};

module.exports = {
  adminLogin,
  roleCheck,
  getAllBookings,
  updateBookingStatus,
  upsertAccommodation,
  listAccommodations,
  upsertInventory,
  listPayments,
  requestRefund,
  listUsers,
  listOtpLogs,
  listEmailLogs,
  listWebhookLogs,
  listAuditLogs,
};
