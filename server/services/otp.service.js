const crypto = require("crypto");
const OtpVerification = require("../models/otp.model");
const AppError = require("../utils/AppError");
const { env } = require("../config/env");
const { sendOtpEmail } = require("./email.service");

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const createSalt = () => crypto.randomBytes(16).toString("hex");

const hashOtp = ({ email, purpose, otp, salt }) =>
  crypto
    .createHmac("sha256", env.otpSecret)
    .update(`${normalizeEmail(email)}.${purpose}.${otp}.${salt}`)
    .digest("hex");

const compareOtp = ({ otpHash, email, purpose, otp, salt }) => {
  const expected = hashOtp({ email, purpose, otp, salt });

  if (!otpHash || otpHash.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(otpHash), Buffer.from(expected));
};

const activeOtpQuery = ({ email, purpose, requestId }) => {
  const query = {
    consumedAt: null,
    expiresAt: { $gt: new Date() },
  };

  if (requestId) {
    query.requestId = requestId;
  }

  if (email) {
    query.email = normalizeEmail(email);
  }

  if (purpose) {
    query.purpose = purpose;
  }

  return OtpVerification.findOne(query)
    .sort({ createdAt: -1 })
    .select("+otpHash +salt")
    .exec();
};

const secondsUntil = (date) =>
  Math.max(Math.ceil((date.getTime() - Date.now()) / 1000), 0);

const assertCanResend = (record, now) => {
  if (record.lockedUntil && record.lockedUntil > now) {
    throw new AppError("OTP verification is temporarily locked.", 423, {
      retryAfterSeconds: secondsUntil(record.lockedUntil),
    });
  }

  const secondsSinceLastSend = Math.floor((now - record.lastSentAt) / 1000);
  if (secondsSinceLastSend < env.otpResendCooldownSeconds) {
    throw new AppError("Please wait before requesting another OTP.", 429, {
      retryAfterSeconds: env.otpResendCooldownSeconds - secondsSinceLastSend,
    });
  }

  if (record.resendCount >= record.maxResends) {
    throw new AppError("OTP resend limit exceeded. Please try again later.", 429);
  }
};

const issueOtpChallenge = async ({
  email,
  purpose = "login",
  requestId,
  ipAddress,
  userAgent,
  requireExisting = false,
}) => {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();
  let record = await activeOtpQuery({ email: normalizedEmail, purpose, requestId });

  if (requireExisting && !record) {
    throw new AppError("OTP request was not found or has expired.", 404);
  }

  if (record) {
    assertCanResend(record, now);
  }

  const otp = generateOtp();
  const salt = createSalt();
  const expiresAt = new Date(now.getTime() + env.otpTtlMinutes * 60 * 1000);
  const otpHash = hashOtp({ email: normalizedEmail, purpose, otp, salt });

  if (record) {
    record.otpHash = otpHash;
    record.salt = salt;
    record.expiresAt = expiresAt;
    record.lastSentAt = now;
    record.attempts = 0;
    record.resendCount += 1;
    record.ipAddress = ipAddress;
    record.userAgent = userAgent;
    await record.save();
  } else {
    record = await OtpVerification.create({
      email: normalizedEmail,
      purpose,
      otpHash,
      salt,
      expiresAt,
      lastSentAt: now,
      maxAttempts: env.otpMaxAttempts,
      maxResends: env.otpMaxResends,
      ipAddress,
      userAgent,
    });
  }

  await sendOtpEmail({ to: normalizedEmail, otp, purpose });

  return {
    requestId: record.requestId,
    expiresAt,
    expiresInSeconds: secondsUntil(expiresAt),
    resendAvailableInSeconds: env.otpResendCooldownSeconds,
  };
};

const verifyOtpChallenge = async ({
  email,
  purpose = "login",
  otp,
  requestId,
}) => {
  const normalizedEmail = normalizeEmail(email);
  const record = await activeOtpQuery({
    email: normalizedEmail,
    purpose,
    requestId,
  });
  const now = new Date();

  if (!record) {
    throw new AppError("Invalid or expired OTP.", 401);
  }

  if (record.lockedUntil && record.lockedUntil > now) {
    throw new AppError("OTP verification is temporarily locked.", 423, {
      retryAfterSeconds: secondsUntil(record.lockedUntil),
    });
  }

  if (record.attempts >= record.maxAttempts) {
    record.lockedUntil = new Date(now.getTime() + env.otpLockMinutes * 60 * 1000);
    await record.save();
    throw new AppError("OTP verification is temporarily locked.", 423);
  }

  const isValid = compareOtp({
    otpHash: record.otpHash,
    email: record.email,
    purpose: record.purpose,
    otp: String(otp),
    salt: record.salt,
  });

  if (!isValid) {
    record.attempts += 1;

    if (record.attempts >= record.maxAttempts) {
      record.lockedUntil = new Date(
        now.getTime() + env.otpLockMinutes * 60 * 1000
      );
      await record.save();
      throw new AppError("OTP verification is temporarily locked.", 423);
    }

    await record.save();
    throw new AppError("Invalid or expired OTP.", 401, {
      attemptsRemaining: record.maxAttempts - record.attempts,
    });
  }

  record.consumedAt = now;
  await record.save();

  await OtpVerification.updateMany(
    {
      _id: { $ne: record._id },
      email: normalizedEmail,
      purpose,
      consumedAt: null,
    },
    { $set: { consumedAt: now } }
  );

  return {
    email: normalizedEmail,
    purpose,
    requestId: record.requestId,
  };
};

module.exports = {
  normalizeEmail,
  generateOtp,
  hashOtp,
  issueOtpChallenge,
  verifyOtpChallenge,
};
