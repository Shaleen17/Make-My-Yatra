const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "bookings", index: true },
    user: { type: String, index: true },
    provider: { type: String, default: "razorpay", index: true },
    razorpayDetails: {
      orderId: { type: String, index: true, unique: true, sparse: true },
      paymentId: { type: String, index: true, unique: true, sparse: true },
      signature: { type: String },
    },
    amount: { type: Number, min: 0, index: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded", "cancelled"],
      default: "created",
      index: true,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    success: { type: Boolean, default: false },
    failureReason: { type: String },
    providerPayload: { type: mongoose.Schema.Types.Mixed },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

const Payment = mongoose.model("payments", paymentSchema);

module.exports = Payment;
