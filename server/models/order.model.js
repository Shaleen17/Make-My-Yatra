const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: String, index: true },
    flight_date: { type: String, index: true },
    flight_status: { type: String },
    status: {
      type: String,
      enum: ["draft", "pending", "confirmed", "cancelled", "failed"],
      default: "pending",
      index: true,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    departure: {
      airport: { type: String },
      timezone: { type: String },
      iata: { type: String },
      icao: { type: String },
      terminal: { type: String },
      gate: { type: String },
      delay: { type: Number },
      scheduled: { type: String },
      estimated: { type: String },
      actual: { type: String },
      estimated_runway: { type: String },
      actual_runway: { type: String },
    },
    arrival: {
      airport: { type: String },
      timezone: { type: String },
      iata: { type: String },
      icao: { type: String },
      terminal: { type: String },
      baggage: { type: String },
      gate: { type: String },
      delay: { type: Number },
      scheduled: { type: String },
      estimated: { type: String },
      actual: { type: String },
      estimated_runway: { type: String },
      actual_runway: { type: String },
    },
    airline: {
      name: { type: String },
      iata: { type: String },
      icao: { type: String },
    },
    flight: {
      aircraft: { type: String },
      live: { type: mongoose.Schema.Types.Mixed },
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

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model("orders", orderSchema);

module.exports = Order;
