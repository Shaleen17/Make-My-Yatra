const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
  {
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  { _id: false }
);

const checkoutSchema = new mongoose.Schema(
  {
    price: {
      base_fare: { type: Number, min: 0 },
      surcharges: { type: Number, min: 0 },
    },
    date: { type: String, index: true },
    user: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "confirmed", "cancelled", "expired"],
      default: "pending",
      index: true,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    audit: auditSchema,
    deletedAt: { type: Date, default: null, index: true },
  },
  {
    timestamps: true,
    strict: false,
  }
);

checkoutSchema.index({ user: 1, createdAt: -1 });
checkoutSchema.index({ status: 1, createdAt: -1 });

const Checkout = mongoose.model("checkouts", checkoutSchema);

module.exports = Checkout;
