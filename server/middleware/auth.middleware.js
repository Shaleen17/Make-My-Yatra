const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../services/auth.service");

const getBearerToken = (req) => {
  const header = req.get("authorization") || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return req.cookies?.authToken;
};

const requireAuth = (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    return next(new AppError("Authentication is required.", 401));
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired session.", 401));
  }
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication is required.", 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError("You do not have permission to access this resource.", 403));
  }

  return next();
};

module.exports = {
  requireAuth,
  requireRoles,
};
