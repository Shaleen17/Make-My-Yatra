const cookie = require("cookie");
const { verifyAccessToken } = require("../services/auth.service");
const logger = require("../utils/logger");

let io;

const extractSocketToken = (socket) => {
  if (socket.handshake.auth?.token) {
    return socket.handshake.auth.token;
  }

  const header = socket.handshake.headers?.authorization || "";
  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
  return cookies.authToken;
};

const socketAuthMiddleware = (socket, next) => {
  const token = extractSocketToken(socket);

  if (!token) {
    socket.user = { role: "guest" };
    return next();
  }

  try {
    socket.user = verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new Error("Invalid socket authentication token."));
  }
};

const initSocket = (httpServer, corsOptions) => {
  const { Server } = require("socket.io");

  io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    const userId = socket.user?.sub;

    if (userId) {
      socket.join(`user:${userId}`);
    }

    if (["admin", "superadmin", "support"].includes(socket.user?.role)) {
      socket.join("admin");
    }

    socket.on("join_booking", (bookingId) => {
      if (bookingId) {
        socket.join(`booking:${bookingId}`);
      }
    });

    socket.on("join_user", (targetUserId) => {
      if (targetUserId && targetUserId === userId) {
        socket.join(`user:${targetUserId}`);
      }
    });

    socket.on("join_admin", () => {
      if (["admin", "superadmin", "support"].includes(socket.user?.role)) {
        socket.join("admin");
      }
    });

    socket.on("support_message", (message) => {
      emitToAdmin("support_message_received", {
        ...message,
        userId: userId || message?.userId || "guest",
        createdAt: new Date().toISOString(),
      });
    });
  });

  return io;
};

const emitToRoom = (room, event, payload) => {
  if (!io) {
    logger.debug({ room, event }, "socket emit skipped: io not initialized");
    return;
  }

  io.to(room).emit(event, payload);
};

const emitToUser = (userId, event, payload) =>
  userId && emitToRoom(`user:${userId}`, event, payload);

const emitToBooking = (bookingId, event, payload) =>
  bookingId && emitToRoom(`booking:${bookingId}`, event, payload);

const emitToAdmin = (event, payload) => emitToRoom("admin", event, payload);

const serializeBookingEvent = (booking) => ({
  bookingId: String(booking._id),
  user: booking.user,
  userEmail: booking.userEmail,
  bookingStatus: booking.bookingStatus,
  paymentStatus: booking.paymentStatus,
  razorpayOrderId: booking.razorpayOrderId,
  razorpayPaymentId: booking.razorpayPaymentId,
  amount: booking.amount,
});

const emitBookingCreated = (booking) => {
  const payload = serializeBookingEvent(booking);
  emitToBooking(booking._id, "booking_created", payload);
  emitToUser(booking.user, "booking_created", payload);
  emitToUser(booking.userEmail, "booking_created", payload);
  emitToAdmin("admin_new_booking", payload);
};

const emitBookingStatusUpdated = (booking) => {
  if (!booking?._id) return;
  const payload = serializeBookingEvent(booking);
  emitToBooking(booking._id, "booking_status_updated", payload);
  emitToUser(booking.user, "booking_status_updated", payload);
  emitToUser(booking.userEmail, "booking_status_updated", payload);
  emitToAdmin("booking_status_updated", payload);
};

const emitPaymentSuccess = (booking) => {
  const payload = serializeBookingEvent(booking);
  emitToBooking(booking._id, "payment_success", payload);
  emitToUser(booking.user, "payment_success", payload);
  emitToUser(booking.userEmail, "payment_success", payload);
  emitToAdmin("payment_success", payload);
};

const emitPaymentFailed = (booking) => {
  const payload = serializeBookingEvent(booking);
  emitToBooking(booking._id, "payment_failed", payload);
  emitToUser(booking.user, "payment_failed", payload);
  emitToUser(booking.userEmail, "payment_failed", payload);
  emitToAdmin("payment_failed", payload);
};

const emitRoomAvailabilityUpdated = (payload) => {
  emitToAdmin("room_availability_updated", payload);
  emitToRoom(`availability:${payload.accommodationSlug}`, "room_availability_updated", payload);
};

module.exports = {
  initSocket,
  emitToRoom,
  emitToUser,
  emitToBooking,
  emitToAdmin,
  emitBookingCreated,
  emitBookingStatusUpdated,
  emitPaymentSuccess,
  emitPaymentFailed,
  emitRoomAvailabilityUpdated,
};
