const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const RefreshToken = require("../models/refreshToken.model");

const normalizeIdentifier = (identifier) =>
  String(identifier || "").trim().toLowerCase();

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

const createOtpHash = ({ identifier, otp }) => {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const expiresAt = Date.now() + env.otpTtlMinutes * 60 * 1000;
  const payload = `${normalizedIdentifier}.${otp}.${expiresAt}`;
  const digest = crypto
    .createHmac("sha256", env.otpSecret)
    .update(payload)
    .digest("hex");

  return `${expiresAt}.${digest}`;
};

const verifyOtpHash = ({ identifier, otp, hash }) => {
  const normalizedIdentifier = normalizeIdentifier(identifier);
  const [expiresAt, digest] = String(hash || "").split(".");

  if (!expiresAt || !digest || Number(expiresAt) < Date.now()) {
    return false;
  }

  const payload = `${normalizedIdentifier}.${otp}.${expiresAt}`;
  const expectedDigest = crypto
    .createHmac("sha256", env.otpSecret)
    .update(payload)
    .digest("hex");

  if (digest.length !== expectedDigest.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(expectedDigest)
  );
};

const createAccessToken = ({ subject, role = "user" }) =>
  jwt.sign({ sub: subject, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const createRefreshToken = ({ subject, role = "user", tokenId }) =>
  jwt.sign({ sub: subject, role, typ: "refresh", jti: tokenId }, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const getRefreshExpiryDate = () => {
  const days = String(env.refreshTokenExpiresIn).endsWith("d")
    ? Number(String(env.refreshTokenExpiresIn).replace("d", ""))
    : 7;

  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

const createSessionTokens = ({ subject, role = "user" }) => {
  const tokenId = crypto.randomUUID();
  return {
    accessToken: createAccessToken({ subject, role }),
    refreshToken: createRefreshToken({ subject, role, tokenId }),
    refreshTokenId: tokenId,
  };
};

const persistRefreshToken = async ({ refreshToken, refreshTokenId, subject, req }) =>
  env.isTest
    ? null
    : RefreshToken.create({
    tokenId: refreshTokenId,
    subject,
    tokenHash: hashToken(refreshToken),
    userAgent: req?.get?.("user-agent"),
    ipAddress: req?.ip,
    expiresAt: getRefreshExpiryDate(),
  });

const verifyRefreshToken = (token) =>
  jwt.verify(token, env.refreshTokenSecret);

const verifyAccessToken = (token) => jwt.verify(token, env.jwtSecret);

const rotateRefreshToken = async ({ refreshToken, req }) => {
  const payload = verifyRefreshToken(refreshToken);

  if (env.isTest) {
    const tokens = createSessionTokens({
      subject: payload.sub,
      role: payload.role || "user",
    });
    return { ...tokens, subject: payload.sub, role: payload.role || "user" };
  }

  const existing = await RefreshToken.findOne({
    tokenId: payload.jti,
    tokenHash: hashToken(refreshToken),
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).exec();

  if (!existing) {
    throw new Error("Refresh token is invalid or revoked.");
  }

  const tokens = createSessionTokens({
    subject: payload.sub,
    role: payload.role || "user",
  });
  existing.revokedAt = new Date();
  existing.replacedByTokenId = tokens.refreshTokenId;
  await existing.save();
  await persistRefreshToken({
    refreshToken: tokens.refreshToken,
    refreshTokenId: tokens.refreshTokenId,
    subject: payload.sub,
    req,
  });

  return { ...tokens, subject: payload.sub, role: payload.role || "user" };
};

const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;
  if (env.isTest) return;

  const payload = verifyRefreshToken(refreshToken);
  await RefreshToken.findOneAndUpdate(
    { tokenId: payload.jti, tokenHash: hashToken(refreshToken) },
    { $set: { revokedAt: new Date() } }
  ).exec();
};

module.exports = {
  normalizeIdentifier,
  generateOtp,
  createOtpHash,
  verifyOtpHash,
  createSessionTokens,
  persistRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
};
