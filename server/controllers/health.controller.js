const mongoose = require("mongoose");
const { env } = require("../config/env");
const { getEmailHealth } = require("../services/email.service");
const { getRedisClient } = require("../config/redis");

const getHealth = (req, res) =>
  res.status(200).json({
    status: "ok",
    service: "make-my-yatra-api",
    environment: env.nodeEnv,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState,
  });

const getDbHealth = (req, res) =>
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? "ok" : "degraded",
    database: {
      readyState: mongoose.connection.readyState,
      name: mongoose.connection.name,
      host: mongoose.connection.host,
    },
  });

const getEmailHealthStatus = (req, res) => {
  const health = getEmailHealth();

  return res.status(health.configured ? 200 : 503).json({
    status: health.configured ? "ok" : "degraded",
    provider: health.provider,
    configured: health.configured,
    brevoConfigured: health.brevoConfigured,
    smtpFallbackConfigured: health.smtpFallbackConfigured,
    senderConfigured: health.senderConfigured,
  });
};

const getPaymentHealth = (req, res) => {
  const configured = Boolean(env.razorpay.keyId && env.razorpay.keySecret);
  return res.status(configured ? 200 : 503).json({
    status: configured ? "ok" : "degraded",
    provider: "razorpay",
    configured,
    webhookConfigured: Boolean(env.razorpay.webhookSecret),
    currency: env.razorpay.currency,
  });
};

const getRedisHealth = (req, res) => {
  const client = getRedisClient();
  const enabled = Boolean(client);
  const ready = client?.status === "ready";

  return res.status(!enabled || ready ? 200 : 503).json({
    status: !enabled || ready ? "ok" : "degraded",
    enabled,
    ready,
    state: client?.status || "disabled",
  });
};

module.exports = {
  getHealth,
  getDbHealth,
  getEmailHealthStatus,
  getPaymentHealth,
  getRedisHealth,
};
