const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const connect = require("./config/db");
const { connectRedis } = require("./config/redis");
const corsOptions = require("./config/cors");
const { env } = require("./config/env");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/error.middleware");
const requestId = require("./middleware/requestId.middleware");
const requestLogger = require("./middleware/logger.middleware");
const sanitizers = require("./middleware/sanitize.middleware");
const metricsMiddleware = require("./middleware/metrics.middleware");
const notFound = require("./middleware/notFound.middleware");
const requestRateLimiter = require("./middleware/rateLimit.middleware");
const routes = require("./routes");
const { startWorkers } = require("./jobs");
const { initSocket } = require("./socket");

const createServer = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", env.trustProxy);

  app.use(requestId);
  app.use(requestLogger);
  app.use(metricsMiddleware);
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(compression());
  app.use(cookieParser(env.cookieSecret));
  app.use(
    ["/api/v1/payments/webhook", "/payments/webhook"],
    express.raw({ type: "application/json", limit: env.bodyLimit })
  );
  app.use(express.json({ limit: env.bodyLimit }));
  app.use(express.urlencoded({ extended: true, limit: env.bodyLimit }));
  app.use(sanitizers);
  app.use(requestRateLimiter);

  app.use(routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

const start = async () => {
  await connect();
  await connectRedis();
  startWorkers();
  const app = createServer();
  const httpServer = http.createServer(app);

  initSocket(httpServer, {
    origin: env.clientOrigins,
    credentials: true,
  });

  httpServer.listen(env.port, () =>
    logger.info({ port: env.port }, "Make My Yatra API listening")
  );
};

module.exports = start;
module.exports.createServer = createServer;
