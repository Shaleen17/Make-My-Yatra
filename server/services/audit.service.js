const AuditLog = require("../models/auditLog.model");
const { env } = require("../config/env");
const logger = require("../utils/logger");

const writeAuditLog = async ({
  action,
  actorId,
  actorRole,
  targetType,
  targetId,
  status = "info",
  req,
  metadata,
}) => {
  if (env.isTest) {
    return null;
  }

  const payload = {
    action,
    actorId: actorId || req?.user?.sub,
    actorRole: actorRole || req?.user?.role,
    targetType,
    targetId,
    status,
    ipAddress: req?.ip,
    userAgent: req?.get?.("user-agent"),
    requestId: req?.id,
    metadata,
  };

  try {
    return await AuditLog.create(payload);
  } catch (error) {
    logger.warn({ err: error, action }, "audit log write failed");
    return null;
  }
};

module.exports = {
  writeAuditLog,
};
