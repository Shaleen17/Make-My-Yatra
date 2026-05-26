const pino = require("pino");
const { env } = require("../config/env");

const logger = pino({
  level: env.logLevel,
  base: {
    service: "make-my-yatra-api",
    environment: env.nodeEnv,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie",
      "*.password",
      "*.token",
      "*.apiKey",
      "*.BREVO_API_KEY",
      "*.RAZORPAY_KEY_SECRET",
      "*.GOOGLE_FLIGHT_API_KEY",
      "*.Google_Flight_API_KEY",
      "*.SERPAPI_API_KEY",
      "*.FLIGHT_API_KEY",
      "*.FLIGHTS_API_KEY",
    ],
    remove: true,
  },
});

module.exports = logger;
