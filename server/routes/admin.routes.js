const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const authRateLimiter = require("../middleware/authRateLimit.middleware");
const { requireAuth, requireRoles } = require("../middleware/auth.middleware");
const {
  adminLogin,
  roleCheck,
  getAllBookings,
  updateBookingStatus,
  upsertAccommodation,
  listAccommodations,
  upsertInventory,
  listPayments,
  requestRefund,
  listUsers,
  listOtpLogs,
  listEmailLogs,
  listWebhookLogs,
  listAuditLogs,
} = require("../controllers/admin.controller");

const router = express.Router();
const adminOnly = [requireAuth, requireRoles("admin", "superadmin", "support")];
const managerOnly = [requireAuth, requireRoles("admin", "superadmin")];
const superAdminOnly = [requireAuth, requireRoles("superadmin")];

router.post("/login", authRateLimiter, asyncHandler(adminLogin));
router.get("/role-check", ...adminOnly, roleCheck);
router.get("/bookings", ...adminOnly, asyncHandler(getAllBookings));
router.patch("/bookings/:id/status", ...managerOnly, asyncHandler(updateBookingStatus));
router.get("/accommodations", ...adminOnly, asyncHandler(listAccommodations));
router.post("/accommodations", ...managerOnly, asyncHandler(upsertAccommodation));
router.post("/inventory", ...managerOnly, asyncHandler(upsertInventory));
router.get("/payments", ...adminOnly, asyncHandler(listPayments));
router.post("/payments/:id/refund", ...managerOnly, asyncHandler(requestRefund));
router.get("/users", ...adminOnly, asyncHandler(listUsers));
router.get("/otp-logs", ...adminOnly, asyncHandler(listOtpLogs));
router.get("/email-logs", ...adminOnly, asyncHandler(listEmailLogs));
router.get("/webhook-logs", ...adminOnly, asyncHandler(listWebhookLogs));
router.get("/audit-logs", ...superAdminOnly, asyncHandler(listAuditLogs));

module.exports = router;
