const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    accommodationSlug: { type: String, required: true, index: true },
    roomTypeId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    totalUnits: { type: Number, required: true, min: 0 },
    reservedUnits: { type: Number, default: 0, min: 0 },
    soldUnits: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

inventorySchema.index(
  { accommodationSlug: 1, roomTypeId: 1, date: 1 },
  { unique: true }
);

const Inventory = mongoose.model("inventories", inventorySchema);

module.exports = Inventory;
