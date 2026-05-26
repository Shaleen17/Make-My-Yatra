const AppError = require("../utils/AppError");

const formatIssues = (issues) =>
  issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

const validateRequest = (schema) => (req, res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!parsed.success) {
    return next(
      new AppError("Validation failed.", 400, formatIssues(parsed.error.issues))
    );
  }

  if (parsed.data.body !== undefined) {
    req.body = parsed.data.body;
  }

  if (parsed.data.params !== undefined) {
    req.params = parsed.data.params;
  }

  if (parsed.data.query !== undefined) {
    req.query = parsed.data.query;
  }

  return next();
};

module.exports = validateRequest;
