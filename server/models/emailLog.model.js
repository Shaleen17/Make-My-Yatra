const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
  {
    provider: { type: String, index: true },
    to: { type: String, index: true },
    subject: { type: String },
    purpose: { type: String, index: true },
    status: {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued",
      index: true,
    },
    messageId: { type: String, index: true },
    error: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

emailLogSchema.index({ createdAt: -1 });

const EmailLog = mongoose.model("email_logs", emailLogSchema);

module.exports = EmailLog;
