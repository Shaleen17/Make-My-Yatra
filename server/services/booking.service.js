const Booking = require("../models/booking.model");
const Accommodation = require("../models/accommodation.model");
const Inventory = require("../models/inventory.model");
const AppError = require("../utils/AppError");
const { env } = require("../config/env");

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const toDate = (value) => (value ? new Date(value) : undefined);

const getIdempotencyKey = (req) =>
  req.get("Idempotency-Key") || req.body?.idempotencyKey;

const calculateLegacyAmount = (flight) => {
  const delay = Number(flight?.departure?.delay || 0);
  const baseAmount = delay > 0 ? delay * 200 : 5050;
  const feeAmount = 755;
  const discountAmount = 500;
  const finalAmount = delay > 0 ? baseAmount : baseAmount + feeAmount - discountAmount;

  return {
    baseAmount,
    taxAmount: 0,
    feeAmount: delay > 0 ? 0 : feeAmount,
    discountAmount: delay > 0 ? 0 : discountAmount,
    finalAmount: finalAmount || env.defaultBookingAmount,
    currency: env.razorpay.currency,
  };
};

const getNights = ({ checkIn, checkOut }) => {
  if (!checkIn || !checkOut) {
    return 1;
  }

  const diff = checkOut.getTime() - checkIn.getTime();
  return Math.max(Math.ceil(diff / (24 * 60 * 60 * 1000)), 1);
};

const ensureAccommodationAvailability = async ({
  accommodationSlug,
  roomTypeId,
  quantity,
  checkIn,
  checkOut,
}) => {
  if (!accommodationSlug || !roomTypeId || !checkIn || !checkOut) {
    throw new AppError("Accommodation, room, check-in, and check-out are required.", 400);
  }

  const inventoryRows = await Inventory.find({
    accommodationSlug,
    roomTypeId,
    date: { $gte: checkIn, $lt: checkOut },
  })
    .lean()
    .exec();

  if (!inventoryRows.length) {
    throw new AppError("Room availability is not configured for these dates.", 409);
  }

  const hasAvailability = inventoryRows.every(
    (row) => row.totalUnits - row.reservedUnits - row.soldUnits >= quantity
  );

  if (!hasAvailability) {
    throw new AppError("Selected room is no longer available.", 409);
  }
};

const reserveAccommodationInventory = async ({
  accommodationSlug,
  roomTypeId,
  quantity,
  checkIn,
  checkOut,
}) => {
  const result = await Inventory.updateMany(
    {
      accommodationSlug,
      roomTypeId,
      date: { $gte: checkIn, $lt: checkOut },
      $expr: {
        $gte: [
          { $subtract: ["$totalUnits", { $add: ["$reservedUnits", "$soldUnits"] }] },
          quantity,
        ],
      },
    },
    { $inc: { reservedUnits: quantity } }
  ).exec();

  if (!result.modifiedCount) {
    throw new AppError("Selected room is no longer available.", 409);
  }

  return result.modifiedCount;
};

const releaseAccommodationInventory = async (booking) => {
  if (
    !booking?.inventoryReserved ||
    booking.inventoryCommitted ||
    booking.bookingType !== "accommodation"
  ) {
    return;
  }

  await Inventory.updateMany(
    {
      accommodationSlug: booking.accommodation?.slug,
      roomTypeId: booking.selectedRoom?.roomTypeId,
      date: { $gte: booking.checkIn, $lt: booking.checkOut },
    },
    { $inc: { reservedUnits: -Number(booking.selectedRoom?.quantity || 1) } }
  ).exec();
};

const commitAccommodationInventory = async (booking) => {
  if (
    !booking?.inventoryReserved ||
    booking.inventoryCommitted ||
    booking.bookingType !== "accommodation"
  ) {
    return;
  }

  const quantity = Number(booking.selectedRoom?.quantity || 1);
  await Inventory.updateMany(
    {
      accommodationSlug: booking.accommodation?.slug,
      roomTypeId: booking.selectedRoom?.roomTypeId,
      date: { $gte: booking.checkIn, $lt: booking.checkOut },
    },
    { $inc: { reservedUnits: -quantity, soldUnits: quantity } }
  ).exec();
};

const calculateBookingAmount = async (payload) => {
  if (payload.bookingType === "accommodation" && payload.accommodation?.slug) {
    const accommodation = await Accommodation.findOne({
      slug: payload.accommodation.slug,
      active: true,
      deletedAt: null,
    })
      .lean()
      .exec();

    if (!accommodation) {
      throw new AppError("Accommodation was not found.", 404);
    }

    const roomTypeId = payload.selectedRoom?.roomTypeId;
    const room = accommodation.roomTypes?.find(
      (item) => item.roomTypeId === roomTypeId && item.active !== false
    );

    if (!room) {
      throw new AppError("Selected room was not found.", 404);
    }

    const quantity = Number(payload.selectedRoom?.quantity || 1);
    const checkIn = toDate(payload.checkIn);
    const checkOut = toDate(payload.checkOut);
    await ensureAccommodationAvailability({
      accommodationSlug: accommodation.slug,
      roomTypeId,
      quantity,
      checkIn,
      checkOut,
    });

    const nights = getNights({ checkIn, checkOut });
    const baseAmount = room.baseAmount * quantity * nights;
    const taxAmount = Math.round((baseAmount * (room.taxPercent || 0)) / 100);
    const feeAmount = room.feeAmount || 0;
    const finalAmount = baseAmount + taxAmount + feeAmount;

    return {
      amount: {
        baseAmount,
        taxAmount,
        feeAmount,
        discountAmount: 0,
        finalAmount,
        currency: env.razorpay.currency,
      },
      accommodation,
      inventoryReservation: {
        accommodationSlug: accommodation.slug,
        roomTypeId,
        quantity,
        checkIn,
        checkOut,
      },
    };
  }

  return {
    amount: calculateLegacyAmount(payload.flight),
  };
};

const buildBookingDocument = ({ payload, amount, accommodation, idempotencyKey }) => {
  const email = normalizeEmail(payload.userEmail || payload.email || payload.user);
  const bookingType = payload.bookingType || (payload.flight ? "flight" : "legacy");

  return {
    user: payload.user || email || "guest",
    userEmail: email || undefined,
    userName: payload.userName,
    bookingType,
    accommodation: accommodation
      ? {
          id: accommodation._id,
          slug: accommodation.slug,
          name: accommodation.name,
        }
      : payload.accommodation,
    package: payload.package,
    destination:
      payload.destination ||
      payload.flight?.arrival?.iata ||
      payload.flight?.arrival?.airport,
    checkIn: toDate(payload.checkIn),
    checkOut: toDate(payload.checkOut),
    yatraDate: toDate(payload.yatraDate || payload.flight?.flight_date),
    guests: {
      adults: Number(payload.guests?.adults || 1),
      children: Number(payload.guests?.children || 0),
      infants: Number(payload.guests?.infants || 0),
    },
    selectedRoom: payload.selectedRoom,
    selectedPackage: payload.selectedPackage,
    flight: payload.flight,
    amount,
    idempotencyKey,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    metadata: payload.metadata,
  };
};

const createPendingBooking = async ({ payload, idempotencyKey }) => {
  if (idempotencyKey) {
    const existing = await Booking.findOne({ idempotencyKey, deletedAt: null }).exec();
    if (existing) {
      return existing;
    }
  }

  const { amount, accommodation, inventoryReservation } =
    await calculateBookingAmount(payload);
  let inventoryReserved = false;

  if (inventoryReservation) {
    await reserveAccommodationInventory(inventoryReservation);
    inventoryReserved = true;
  }

  const bookingDocument = buildBookingDocument({
    payload,
    amount,
    accommodation,
    idempotencyKey,
  });
  bookingDocument.inventoryReserved = inventoryReserved;

  try {
    return await Booking.create(bookingDocument);
  } catch (error) {
    if (inventoryReserved) {
      await Inventory.updateMany(
        {
          accommodationSlug: inventoryReservation.accommodationSlug,
          roomTypeId: inventoryReservation.roomTypeId,
          date: {
            $gte: inventoryReservation.checkIn,
            $lt: inventoryReservation.checkOut,
          },
        },
        { $inc: { reservedUnits: -inventoryReservation.quantity } }
      ).exec();
    }

    throw error;
  }
};

const createLegacyBookingPayload = () => ({
  user: "guest",
  bookingType: "legacy",
  destination: "Make My Yatra",
  guests: { adults: 1, children: 0, infants: 0 },
  metadata: { source: "legacy-razorpay-endpoint" },
});

const confirmBooking = async ({ bookingId, razorpayOrderId, razorpayPaymentId }) => {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      razorpayOrderId,
      bookingStatus: { $ne: "confirmed" },
      deletedAt: null,
    },
    {
      $set: {
        bookingStatus: "confirmed",
        paymentStatus: "paid",
        razorpayPaymentId,
        confirmedAt: new Date(),
      },
    },
    { new: true }
  ).exec();

  await commitAccommodationInventory(booking);

  if (booking?.inventoryReserved && !booking.inventoryCommitted) {
    booking.inventoryCommitted = true;
    await booking.save();
  }

  return booking;
};

const failBookingPayment = async ({ bookingId, razorpayOrderId, reason }) => {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      ...(razorpayOrderId ? { razorpayOrderId } : {}),
      deletedAt: null,
    },
    {
      $set: {
        bookingStatus: "failed",
        paymentStatus: "failed",
        cancellationReason: reason,
      },
    },
    { new: true }
  ).exec();

  await releaseAccommodationInventory(booking);

  return booking;
};

const cancelBooking = async ({ bookingId, reason }) => {
  const booking = await Booking.findOneAndUpdate(
    {
      _id: bookingId,
      bookingStatus: { $in: ["pending", "confirmed"] },
      deletedAt: null,
    },
    {
      $set: {
        bookingStatus: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
    },
    { new: true }
  ).exec();

  await releaseAccommodationInventory(booking);

  return booking;
};

module.exports = {
  getIdempotencyKey,
  createPendingBooking,
  createLegacyBookingPayload,
  confirmBooking,
  failBookingPayment,
  cancelBooking,
};
