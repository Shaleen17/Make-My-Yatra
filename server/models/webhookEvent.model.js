const mongoose = require("mongoose");

const webhookEventSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "razorpay", index: true },
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed },
    rawPayload: { type: String },
    signature: { type: String },
    processedAt: { type: Date },
    processingStatus: {
      type: String,
      enum: ["received", "processed", "failed", "duplicate"],
      default: "received",
      index: true,
    },
    error: { type: String },
  },
  { timestamps: true }
);

const WebhookEvent = mongoose.model("webhook_events", webhookEventSchema);

module.exports = WebhookEvent;
