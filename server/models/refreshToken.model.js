const crypto = require("crypto");
const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenId: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true,
    },
    subject: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null, index: true },
    replacedByTokenId: { type: String },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("refresh_tokens", refreshTokenSchema);

module.exports = RefreshToken;
