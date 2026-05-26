const pinoHttp = require("pino-http");
const logger = require("../utils/logger");

const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.id,
  customProps: (req) => ({
    requestId: req.id,
    userId: req.user?.sub,
  }),
});

module.exports = requestLogger;
