const express = require("express");
const {
  getHealth,
  getDbHealth,
  getEmailHealthStatus,
  getPaymentHealth,
  getRedisHealth,
} = require("../controllers/health.controller");
const { getMetrics } = require("../services/metrics.service");

const router = express.Router();

router.get("/email", getEmailHealthStatus);
router.get("/db", getDbHealth);
router.get("/payment", getPaymentHealth);
router.get("/redis", getRedisHealth);
router.get("/metrics", async (req, res) => {
  res.setHeader("content-type", "text/plain; version=0.0.4");
  res.send(await getMetrics());
});
router.get("/", getHealth);

module.exports = router;
