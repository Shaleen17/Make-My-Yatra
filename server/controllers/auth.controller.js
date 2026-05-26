const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { env } = require("../config/env");
const {
  normalizeEmail,
  issueOtpChallenge,
  verifyOtpChallenge,
} = require("../services/otp.service");
const {
  createSessionTokens,
  persistRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} = require("../services/auth.service");
const { writeAuditLog } = require("../services/audit.service");

const getEmailFromBody = (body) => normalizeEmail(body.email || body.phone);

const getRequestIdFromBody = (body) => body.requestId || body.hash;

const getPurposeFromBody = (body, fallback = "login") => body.purpose || fallback;

const cookieOptions = (overrides = {}) => ({
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  domain: env.cookieDomain,
  path: "/",
  ...overrides,
});

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("authToken", accessToken, {
    ...cookieOptions({ httpOnly: true, maxAge: env.accessTokenCookieMaxAgeMs }),
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions({ httpOnly: true, maxAge: env.refreshTokenCookieMaxAgeMs }),
  });

  // Existing frontend checks these readable cookie names for login state.
  res.cookie("authSession", "active", {
    ...cookieOptions({ httpOnly: false, maxAge: env.accessTokenCookieMaxAgeMs }),
  });
  res.cookie("refreshTokenID", "active", {
    ...cookieOptions({ httpOnly: false, maxAge: env.refreshTokenCookieMaxAgeMs }),
  });
};

const buildUserResponse = (user, fallback = {}) => ({
  id: user?._id?.toString?.() || user?.id || fallback.id,
  name: user?.name || fallback.name || "Traveller",
  email: user?.email || fallback.email,
  mobile: user?.mobile,
  role: user?.role === "traveller" ? "user" : user?.role || fallback.role || "user",
});

const startSession = async ({ user, email, role, req, res }) => {
  const sessionRole = role || (user?.role === "traveller" ? "user" : user?.role) || "user";
  const subject = email || user.email;
  const tokens = createSessionTokens({ subject, role: sessionRole });
  await persistRefreshToken({
    refreshToken: tokens.refreshToken,
    refreshTokenId: tokens.refreshTokenId,
    subject,
    req,
  });
  setAuthCookies(res, tokens);
  return { role: sessionRole, subject };
};

const clearAuthCookies = (res) => {
  ["authToken", "refreshToken", "authSession", "refreshTokenID"].forEach(
    (name) => res.clearCookie(name, cookieOptions())
  );
};

const register = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const existing = await User.findOne({ email, deletedAt: null }).lean().exec();

  if (existing) {
    throw new AppError("An account already exists with this email address.", 409);
  }

  const user = await User.create({
    name: req.body.name,
    email,
    password: req.body.password,
    mobile: req.body.mobile,
    role: "traveller",
    status: "active",
  });

  const session = await startSession({ user, req, res });
  await writeAuditLog({
    action: "signup",
    actorId: email,
    actorRole: session.role,
    status: "success",
    req,
  });

  return res.status(201).json({
    msg: "Signup successful.",
    message: "Signup successful.",
    user: buildUserResponse(user),
  });
};

const login = async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const user = await User.findOne({ email, deletedAt: null }).select("+password").exec();

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (user.status === "blocked" || user.status === "inactive") {
    throw new AppError("This account is not active. Please contact support.", 403);
  }

  const session = await startSession({ user, req, res });
  await writeAuditLog({
    action: "login",
    actorId: email,
    actorRole: session.role,
    status: "success",
    req,
  });

  return res.status(200).json({
    msg: "Login successful.",
    message: "Login successful.",
    user: buildUserResponse(user),
  });
};

const me = async (req, res) => {
  const email = normalizeEmail(req.user?.sub);
  const user = email
    ? await User.findOne({ email, deletedAt: null }).lean().exec()
    : null;

  return res.status(200).json({
    user: buildUserResponse(user, {
      email,
      role: req.user?.role || "user",
    }),
  });
};

const sendOtp = async (req, res) => {
  const email = getEmailFromBody(req.body);
  const challenge = await issueOtpChallenge({
    email,
    purpose: getPurposeFromBody(req.body),
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.status(200).json({
    msg: "OTP sent successfully.",
    message: "OTP sent successfully.",
    hash: challenge.requestId,
    requestId: challenge.requestId,
    expiresInSeconds: challenge.expiresInSeconds,
    resendAvailableInSeconds: challenge.resendAvailableInSeconds,
  });
};

const resendOtp = async (req, res) => {
  const email = getEmailFromBody(req.body);
  const challenge = await issueOtpChallenge({
    email,
    purpose: getPurposeFromBody(req.body),
    requestId: getRequestIdFromBody(req.body),
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
    requireExisting: true,
  });

  return res.status(200).json({
    msg: "OTP resent successfully.",
    message: "OTP resent successfully.",
    hash: challenge.requestId,
    requestId: challenge.requestId,
    expiresInSeconds: challenge.expiresInSeconds,
    resendAvailableInSeconds: challenge.resendAvailableInSeconds,
  });
};

const verifyOtp = async (req, res) => {
  const email = getEmailFromBody(req.body);

  try {
    await verifyOtpChallenge({
      email,
      purpose: getPurposeFromBody(req.body),
      otp: req.body.otp,
      requestId: getRequestIdFromBody(req.body),
    });
  } catch (error) {
    await writeAuditLog({
      action: "otp_verify_failed",
      actorId: email,
      status: "failure",
      req,
      metadata: { purpose: getPurposeFromBody(req.body) },
    });
    throw error;
  }

  const user = env.isTest
    ? null
    : await User.findOne({ email, deletedAt: null }).lean().exec();
  const role = user?.role === "traveller" ? "user" : user?.role || "user";
  await startSession({ user, email, role, req, res });
  await writeAuditLog({
    action: "login",
    actorId: email,
    actorRole: role,
    status: "success",
    req,
  });

  return res.status(200).json({
    msg: "Login Success",
    message: "Login Success",
    user: buildUserResponse(user, { email, role }),
  });
};

const forgotPassword = async (req, res) => {
  const email = getEmailFromBody(req.body);
  const challenge = await issueOtpChallenge({
    email,
    purpose: "password_reset",
    ipAddress: req.ip,
    userAgent: req.get("user-agent"),
  });

  return res.status(200).json({
    msg: "Password reset OTP sent successfully.",
    message: "Password reset OTP sent successfully.",
    hash: challenge.requestId,
    requestId: challenge.requestId,
    expiresInSeconds: challenge.expiresInSeconds,
    resendAvailableInSeconds: challenge.resendAvailableInSeconds,
  });
};

const resetPassword = async (req, res) => {
  const email = getEmailFromBody(req.body);

  await verifyOtpChallenge({
    email,
    purpose: "password_reset",
    otp: req.body.otp,
    requestId: getRequestIdFromBody(req.body),
  });

  const user = await User.findOne({ email, deletedAt: null }).select("+password");

  if (!user) {
    throw new AppError("No account was found for this email address.", 404);
  }

  user.password = req.body.password;
  await user.save();

  return res.status(200).json({
    msg: "Password reset successfully.",
    message: "Password reset successfully.",
  });
};

const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new AppError("Refresh token is required.", 401);
  }

  const tokens = await rotateRefreshToken({ refreshToken: token, req });
  setAuthCookies(res, tokens);

  return res.status(200).json({ msg: "Session refreshed.", message: "Session refreshed." });
};

const logout = async (req, res) => {
  await revokeRefreshToken(req.cookies?.refreshToken || req.body?.refreshToken).catch(
    () => undefined
  );
  clearAuthCookies(res);
  await writeAuditLog({
    action: "logout",
    actorId: req.user?.sub,
    actorRole: req.user?.role,
    status: "success",
    req,
  });
  return res
    .status(200)
    .json({ msg: "Logged out successfully.", message: "Logged out successfully." });
};

module.exports = {
  register,
  login,
  me,
  sendOtp,
  resendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  refresh,
  logout,
};
