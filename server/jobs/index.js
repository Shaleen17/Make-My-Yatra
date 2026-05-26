const { Queue, Worker } = require("bullmq");
const { env } = require("../config/env");
const { getRedisClient } = require("../config/redis");
const logger = require("../utils/logger");
const { sendEmail } = require("../services/email.service");
const Booking = require("../models/booking.model");
const OtpVerification = require("../models/otp.model");
const {
  failBookingPayment,
} = require("../services/booking.service");
const { sendPaymentFailedEmail } = require("../services/bookingNotification.service");

const getConnection = () => {
  const redis = getRedisClient();
  return redis || undefined;
};

const createQueue = (name) => {
  if (!env.jobsEnabled || !getRedisClient()) {
    return null;
  }

  return new Queue(name, {
    connection: getConnection(),
  });
};

const emailQueue = createQueue("email");
const bookingQueue = createQueue("booking-maintenance");
const webhookQueue = createQueue("webhook-processing");

const enqueueEmail = async (payload) => {
  if (!emailQueue) {
    return sendEmail(payload);
  }

  return emailQueue.add("send-email", payload, {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  });
};

const enqueueBookingExpiry = async ({ bookingId, delayMs = 15 * 60 * 1000 }) => {
  if (!bookingQueue) return null;

  return bookingQueue.add(
    "expire-booking",
    { bookingId },
    {
      delay: delayMs,
      attempts: 2,
      removeOnComplete: 100,
      removeOnFail: 500,
    }
  );
};

const startWorkers = () => {
  if (!env.jobsEnabled || !getRedisClient()) {
    logger.info("background jobs disabled");
    return [];
  }

  const workers = [
    new Worker(
      "email",
      async (job) => {
        if (job.name === "send-email") {
          return sendEmail(job.data);
        }
      },
      { connection: getConnection() }
    ),
    new Worker(
      "booking-maintenance",
      async (job) => {
        if (job.name === "expire-booking") {
          const booking = await Booking.findOne({
            _id: job.data.bookingId,
            bookingStatus: "pending",
            paymentStatus: "pending",
          }).exec();

          if (booking) {
            const failed = await failBookingPayment({
              bookingId: booking._id,
              razorpayOrderId: booking.razorpayOrderId,
              reason: "Payment not completed before expiry.",
            });
            if (failed) {
              await sendPaymentFailedEmail(failed);
            }
          }
        }

        if (job.name === "cleanup-expired-otps") {
          await OtpVerification.deleteMany({
            expiresAt: { $lt: new Date() },
          }).exec();
        }
      },
      { connection: getConnection() }
    ),
  ];

  workers.forEach((worker) => {
    worker.on("failed", (job, error) => {
      logger.error({ err: error, jobId: job?.id, queue: worker.name }, "job failed");
    });
  });

  logger.info("background job workers started");
  return workers;
};

module.exports = {
  emailQueue,
  bookingQueue,
  webhookQueue,
  enqueueEmail,
  enqueueBookingExpiry,
  startWorkers,
};
