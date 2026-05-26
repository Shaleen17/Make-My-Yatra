const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const sanitizeString = (value) =>
  value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "");

const sanitizeObject = (value) => {
  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === "object" && !Buffer.isBuffer(value)) {
    Object.keys(value).forEach((key) => {
      value[key] = sanitizeObject(value[key]);
    });
  }

  return value;
};

const xssSanitizer = (req, res, next) => {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);
  next();
};

module.exports = [
  mongoSanitize({ replaceWith: "_" }),
  hpp(),
  xssSanitizer,
];
