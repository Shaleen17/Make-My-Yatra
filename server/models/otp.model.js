const crypto = require("crypto");
const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ["login", "email_verification", "password_reset"],
      default: "login",
      index: true,
    },
    otpHash: { type: String, required: true, select: false },
    salt: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, index: true },
    lastSentAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, required: true },
    resendCount: { type: Number, default: 0 },
    maxResends: { type: Number, required: true },
    lockedUntil: { type: Date, default: null, index: true },
    consumedAt: { type: Date, default: null, index: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpVerificationSchema.index({
  email: 1,
  purpose: 1,
  consumedAt: 1,
  createdAt: -1,
});

const OtpVerification = mongoose.model(
  "otp_verifications",
  otpVerificationSchema
);

module.exports = OtpVerification;
