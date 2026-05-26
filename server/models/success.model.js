const mongoose = require("mongoose");

const successSchema = new mongoose.Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    razorpay_payment_id: {
      type: String,
      index: true,
      sparse: true,
    },
    user: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "refunded"],
      default: "confirmed",
      index: true,
    },
    audit: {
      createdBy: { type: String },
      updatedBy: { type: String },
    },
    deletedAt: { type: Date, default: null, index: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

successSchema.index({ user: 1, createdAt: -1 });

const Success = mongoose.model("success", successSchema);

module.exports = Success;
