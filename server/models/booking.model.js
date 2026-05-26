const mongoose = require("mongoose");

const amountBreakdownSchema = new mongoose.Schema(
  {
    baseAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    feeAmount: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    finalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    userEmail: { type: String, lowercase: true, trim: true, index: true },
    userName: { type: String, trim: true },
    bookingType: {
      type: String,
      enum: ["flight", "accommodation", "package", "legacy"],
      default: "legacy",
      index: true,
    },
    accommodation: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "accommodations" },
      slug: { type: String, index: true },
      name: { type: String },
    },
    package: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "accommodations" },
      slug: { type: String, index: true },
      name: { type: String },
    },
    destination: { type: String, index: true },
    checkIn: { type: Date, index: true },
    checkOut: { type: Date, index: true },
    yatraDate: { type: Date, index: true },
    guests: {
      adults: { type: Number, default: 1, min: 0 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
    },
    selectedRoom: {
      roomTypeId: { type: String },
      name: { type: String },
      quantity: { type: Number, default: 1, min: 1 },
    },
    selectedPackage: {
      packageId: { type: String },
      name: { type: String },
      quantity: { type: Number, default: 1, min: 1 },
    },
    inventoryReserved: { type: Boolean, default: false },
    inventoryCommitted: { type: Boolean, default: false },
    flight: { type: mongoose.Schema.Types.Mixed },
    amount: amountBreakdownSchema,
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "failed", "expired"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    razorpayOrderId: { type: String, index: true, unique: true, sparse: true },
    razorpayPaymentId: { type: String, index: true, unique: true, sparse: true },
    idempotencyKey: { type: String, index: true, unique: true, sparse: true },
    expiresAt: { type: Date, index: true },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    audit: {
      createdBy: { type: String },
      updatedBy: { type: String },
    },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingStatus: 1, paymentStatus: 1, createdAt: -1 });

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
