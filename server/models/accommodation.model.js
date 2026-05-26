const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema(
  {
    roomTypeId: { type: String, required: true },
    name: { type: String, required: true },
    baseAmount: { type: Number, required: true, min: 0 },
    taxPercent: { type: Number, default: 0, min: 0 },
    feeAmount: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, default: 2, min: 1 },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

const accommodationSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    destination: { type: String, index: true },
    category: { type: String, index: true },
    address: { type: String },
    roomTypes: [roomTypeSchema],
    active: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, strict: false }
);

const Accommodation = mongoose.model("accommodations", accommodationSchema);

module.exports = Accommodation;
