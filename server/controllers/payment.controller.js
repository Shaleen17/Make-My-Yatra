const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const WebhookEvent = require("../models/webhookEvent.model");
const AppError = require("../utils/AppError");
const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
} = require("../services/razorpay.service");
const {
  getIdempotencyKey,
  createPendingBooking,
  createLegacyBookingPayload,
  confirmBooking,
  failBookingPayment,
} = require("../services/booking.service");
const {
  emitBookingStatusUpdated,
  emitPaymentSuccess,
  emitPaymentFailed,
} = require("../socket");
const {
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
} = require("../services/bookingNotification.service");
const { writeAuditLog } = require("../services/audit.service");
const { paymentEvents } = require("../services/metrics.service");

const orderResponse = ({ razorpayOrder, booking, payment }) => ({
  id: razorpayOrder.id || payment?.razorpayDetails?.orderId,
  currency: razorpayOrder.currency || payment?.currency,
  amount: razorpayOrder.amount || payment?.amount,
  bookingId: String(booking._id),
  paymentId: payment?._id ? String(payment._id) : undefined,
});

const findBookingOrFail = async (bookingId) => {
  if (!mongoose.isValidObjectId(bookingId)) {
    throw new AppError("Invalid booking id.", 400);
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    deletedAt: null,
  }).exec();

  if (!booking) {
    throw new AppError("Booking was not found.", 404);
  }

  if (booking.bookingStatus !== "pending" || booking.paymentStatus !== "pending") {
    throw new AppError("Booking is not payable.", 409);
  }

  return booking;
};

const createOrderForBooking = async ({ booking, idempotencyKey }) => {
  if (booking.razorpayOrderId) {
    const existingPayment = await Payment.findOne({
      "razorpayDetails.orderId": booking.razorpayOrderId,
      deletedAt: null,
    }).exec();

    if (existingPayment) {
      return {
        razorpayOrder: {
          id: existingPayment.razorpayDetails.orderId,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
        },
        payment: existingPayment,
      };
    }
  }

  if (idempotencyKey) {
    const existingPayment = await Payment.findOne({
      idempotencyKey,
      deletedAt: null,
    }).exec();

    if (existingPayment?.razorpayDetails?.orderId) {
      booking.razorpayOrderId = existingPayment.razorpayDetails.orderId;
      await booking.save();
      return {
        razorpayOrder: {
          id: existingPayment.razorpayDetails.orderId,
          amount: existingPayment.amount,
          currency: existingPayment.currency,
        },
        payment: existingPayment,
      };
    }
  }

  const razorpayOrder = await createRazorpayOrder(booking.amount.finalAmount, {
    receipt: idempotencyKey || String(booking._id),
    notes: {
      bookingId: String(booking._id),
      bookingType: booking.bookingType,
    },
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: booking.user,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    idempotencyKey,
    status: "created",
    razorpayDetails: {
      orderId: razorpayOrder.id,
    },
  });

  booking.razorpayOrderId = razorpayOrder.id;
  await booking.save();

  return { razorpayOrder, payment };
};

const createPaymentOrder = async (req, res) => {
  let booking;
  const idempotencyKey = getIdempotencyKey(req);

  if (req.body.bookingId) {
    booking = await findBookingOrFail(req.body.bookingId);
  } else {
    booking = await createPendingBooking({
      payload: createLegacyBookingPayload(),
      idempotencyKey,
    });
  }

  const { razorpayOrder, payment } = await createOrderForBooking({
    booking,
    idempotencyKey,
  });

  paymentEvents.inc({ event: "order_created" });

  return res.json(orderResponse({ razorpayOrder, booking, payment }));
};

const verifyPayment = async (req, res) => {
  const isValid = verifyRazorpaySignature(req.body);

  if (!isValid) {
    throw new AppError("Payment signature verification failed.", 400);
  }

  const payment = await Payment.findOneAndUpdate(
    { "razorpayDetails.orderId": req.body.razorpay_order_id },
    {
      $set: {
        status: "paid",
        success: true,
        "razorpayDetails.paymentId": req.body.razorpay_payment_id,
        "razorpayDetails.signature": req.body.razorpay_signature,
      },
    },
    { new: true }
  ).exec();

  if (!payment) {
    throw new AppError("Payment order was not found.", 404);
  }

  const bookingId = req.body.bookingId || payment.booking;
  const booking = await confirmBooking({
    bookingId,
    razorpayOrderId: req.body.razorpay_order_id,
    razorpayPaymentId: req.body.razorpay_payment_id,
  });

  if (!booking) {
    throw new AppError("Booking could not be confirmed.", 409);
  }

  emitBookingStatusUpdated(booking);
  emitPaymentSuccess(booking);
  paymentEvents.inc({ event: "verified" });
  await writeAuditLog({
    action: "payment_verified",
    actorId: booking.user,
    targetType: "booking",
    targetId: String(booking._id),
    status: "success",
    req,
    metadata: {
      razorpayOrderId: req.body.razorpay_order_id,
      razorpayPaymentId: req.body.razorpay_payment_id,
    },
  });
  sendPaymentSuccessEmail(booking).catch((error) =>
    console.error("Payment success email failed:", error.message)
  );

  return res.status(200).json({
    success: true,
    booking,
    payment,
  });
};

const markPaymentFailed = async (req, res) => {
  const payment = req.body.razorpay_order_id
    ? await Payment.findOneAndUpdate(
        { "razorpayDetails.orderId": req.body.razorpay_order_id },
        {
          $set: {
            status: "failed",
            success: false,
            failureReason: req.body.reason,
          },
        },
        { new: true }
      ).exec()
    : null;

  const booking = await failBookingPayment({
    bookingId: req.body.bookingId || payment?.booking,
    razorpayOrderId: req.body.razorpay_order_id,
    reason: req.body.reason || "Payment failed",
  });

  if (booking) {
    emitBookingStatusUpdated(booking);
    emitPaymentFailed(booking);
    paymentEvents.inc({ event: "failed" });
    await writeAuditLog({
      action: "payment_failed",
      actorId: booking.user,
      targetType: "booking",
      targetId: String(booking._id),
      status: "failure",
      req,
      metadata: { reason: req.body.reason },
    });
    sendPaymentFailedEmail(booking).catch((error) =>
      console.error("Payment failed email failed:", error.message)
    );
  }

  return res.status(200).json({ success: true, booking, payment });
};

const rawBodyToString = (req) => {
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString("utf8");
  }

  return JSON.stringify(req.body || {});
};

const persistWebhookEvent = async ({ payload, rawPayload, signature }) => {
  const eventId = payload.id || payload.event_id;

  if (!eventId) {
    throw new AppError("Webhook event id is required.", 400);
  }

  const existing = await WebhookEvent.findOne({ eventId }).exec();
  if (existing?.processingStatus === "processed") {
    return { event: existing, duplicate: true };
  }

  if (existing) {
    return { event: existing, duplicate: true };
  }

  const event = await WebhookEvent.create({
    eventId,
    eventType: payload.event,
    payload,
    rawPayload,
    signature,
  });

  return { event, duplicate: false };
};

const processWebhookPayload = async (payload) => {
  const paymentEntity = payload.payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;

  if (!orderId) {
    return null;
  }

  if (payload.event === "payment.captured" || payload.event === "payment.authorized") {
    const payment = await Payment.findOneAndUpdate(
      { "razorpayDetails.orderId": orderId },
      {
        $set: {
          status: "paid",
          success: true,
          "razorpayDetails.paymentId": paymentEntity.id,
          providerPayload: paymentEntity,
        },
      },
      { new: true }
    ).exec();

    if (!payment) return null;

    const booking = await confirmBooking({
      bookingId: payment.booking,
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentEntity.id,
    });

    if (booking) {
      emitBookingStatusUpdated(booking);
      emitPaymentSuccess(booking);
      sendPaymentSuccessEmail(booking).catch((error) =>
        console.error("Payment success email failed:", error.message)
      );
    }

    return booking;
  }

  if (payload.event === "payment.failed") {
    const payment = await Payment.findOneAndUpdate(
      { "razorpayDetails.orderId": orderId },
      {
        $set: {
          status: "failed",
          success: false,
          failureReason: paymentEntity.error_description,
          providerPayload: paymentEntity,
        },
      },
      { new: true }
    ).exec();

    if (!payment) return null;

    const booking = await failBookingPayment({
      bookingId: payment.booking,
      razorpayOrderId: orderId,
      reason: paymentEntity.error_description || "Payment failed",
    });

    if (booking) {
      emitBookingStatusUpdated(booking);
      emitPaymentFailed(booking);
      sendPaymentFailedEmail(booking).catch((error) =>
        console.error("Payment failed email failed:", error.message)
      );
    }

    return booking;
  }

  return null;
};

const handleRazorpayWebhook = async (req, res) => {
  const rawPayload = rawBodyToString(req);
  const signature = req.get("x-razorpay-signature");
  const isValid = verifyRazorpayWebhookSignature({
    rawBody: rawPayload,
    signature,
  });

  if (!isValid) {
    throw new AppError("Invalid Razorpay webhook signature.", 400);
  }

  const payload = JSON.parse(rawPayload);
  const { event, duplicate } = await persistWebhookEvent({
    payload,
    rawPayload,
    signature,
  });

  if (duplicate) {
    return res.status(200).json({ success: true, duplicate: true });
  }

  try {
    await processWebhookPayload(payload);
    event.processingStatus = "processed";
    event.processedAt = new Date();
    await event.save();
  } catch (error) {
    event.processingStatus = "failed";
    event.error = error.message;
    await event.save();
    throw error;
  }

  return res.status(200).json({ success: true });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed,
  handleRazorpayWebhook,
};
