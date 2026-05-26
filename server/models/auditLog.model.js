const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, index: true },
    actorId: { type: String, index: true },
    actorRole: { type: String, index: true },
    targetType: { type: String, index: true },
    targetId: { type: String, index: true },
    status: {
      type: String,
      enum: ["success", "failure", "info"],
      default: "info",
      index: true,
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    requestId: { type: String, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("audit_logs", auditLogSchema);

module.exports = AuditLog;
