const crypto = require("crypto");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const { env } = require("../config/env");

const getRazorpayClient = () => {
  if (!env.razorpay.keyId || !env.razorpay.keySecret) {
    throw new Error(
      "Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env."
    );
  }

  return new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
};

const createRazorpayOrder = (amount, options = {}) => {
  const razorpay = getRazorpayClient();
  const amountInPaise = Math.round(Number(amount) * 100);

  return razorpay.orders.create({
    amount: amountInPaise,
    currency: env.razorpay.currency,
    receipt: options.receipt || shortid.generate(),
    payment_capture: 1,
    notes: options.notes || {},
  });
};

const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  if (!env.razorpay.keySecret) {
    throw new Error("Missing Razorpay key secret.");
  }

  const digest = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (digest.length !== String(razorpay_signature || "").length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(String(razorpay_signature || ""))
  );
};

const verifyRazorpayWebhookSignature = ({ rawBody, signature }) => {
  if (!env.razorpay.webhookSecret) {
    throw new Error("Missing Razorpay webhook secret.");
  }

  const digest = crypto
    .createHmac("sha256", env.razorpay.webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (digest.length !== String(signature || "").length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(String(signature || ""))
  );
};

const refundPayment = ({ paymentId, amount }) => {
  const razorpay = getRazorpayClient();

  return razorpay.payments.refund(paymentId, {
    amount: amount ? Math.round(Number(amount) * 100) : undefined,
  });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
  refundPayment,
};
