const express = require("express");

const adminRoutes = require("./admin.routes");
const authRoutes = require("./auth.routes");
const bookingRoutes = require("./booking.routes");
const checkoutRoutes = require("./checkout.routes");
const flightRoutes = require("./flight.routes");
const healthRoutes = require("./health.routes");
const orderRoutes = require("./order.routes");
const paymentRoutes = require("./payment.routes");
const searchRoutes = require("./search.routes");
const successRoutes = require("./success.routes");
const supportRoutes = require("./support.routes");
const userRoutes = require("./user.routes");

const router = express.Router();
const v1Router = express.Router();

router.get("/", (req, res) => res.send("Hello World!"));
router.use("/health", healthRoutes);

v1Router.use("/admin", adminRoutes);
v1Router.use("/auth", authRoutes);
v1Router.use("/bookings", bookingRoutes);
v1Router.use("/search", searchRoutes);
v1Router.use("/support", supportRoutes);
v1Router.use("/users", userRoutes);
v1Router.use("/checkout", checkoutRoutes);
v1Router.use("/flights", flightRoutes);
v1Router.use("/order", orderRoutes);
v1Router.use("/payments", paymentRoutes);
v1Router.use("/razorpay", paymentRoutes);
v1Router.use("/success", successRoutes);
v1Router.use("/health", healthRoutes);

router.use("/api/v1", v1Router);

// Backward-compatible aliases used by the existing frontend and older clients.
router.use("/", authRoutes);
router.use("/admin", adminRoutes);
router.use("/bookings", bookingRoutes);
router.use("/search", searchRoutes);
router.use("/support", supportRoutes);
router.use("/users", userRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/flights", flightRoutes);
router.use("/order", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/razorpay", paymentRoutes);
router.use("/success", successRoutes);

module.exports = router;
