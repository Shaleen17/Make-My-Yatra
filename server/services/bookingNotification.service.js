const { sendEmail } = require("./email.service");

const bookingToRecipient = (booking) =>
  booking?.userEmail || (String(booking?.user || "").includes("@") ? booking.user : null);

const sendBookingPendingEmail = (booking) => {
  const to = bookingToRecipient(booking);
  if (!to) return Promise.resolve();

  return sendEmail({
    to,
    subject: "Your Make My Yatra booking is pending payment",
    text: `Your booking ${booking._id} is pending payment of ${booking.amount.finalAmount} ${booking.amount.currency}.`,
    html: `<p>Your booking <strong>${booking._id}</strong> is pending payment.</p><p>Amount: ${booking.amount.finalAmount} ${booking.amount.currency}</p>`,
  });
};

const sendPaymentSuccessEmail = (booking) => {
  const to = bookingToRecipient(booking);
  if (!to) return Promise.resolve();

  return sendEmail({
    to,
    subject: "Payment received for your Make My Yatra booking",
    text: `Payment received. Your booking ${booking._id} is confirmed.`,
    html: `<p>Payment received.</p><p>Your booking <strong>${booking._id}</strong> is confirmed.</p>`,
  });
};

const sendPaymentFailedEmail = (booking) => {
  const to = bookingToRecipient(booking);
  if (!to) return Promise.resolve();

  return sendEmail({
    to,
    subject: "Payment failed for your Make My Yatra booking",
    text: `Payment failed for booking ${booking._id}. Please try again.`,
    html: `<p>Payment failed for booking <strong>${booking._id}</strong>.</p><p>Please try again.</p>`,
  });
};

const sendCancellationEmail = (booking) => {
  const to = bookingToRecipient(booking);
  if (!to) return Promise.resolve();

  return sendEmail({
    to,
    subject: "Your Make My Yatra booking was cancelled",
    text: `Your booking ${booking._id} was cancelled.`,
    html: `<p>Your booking <strong>${booking._id}</strong> was cancelled.</p>`,
  });
};

module.exports = {
  sendBookingPendingEmail,
  sendPaymentSuccessEmail,
  sendPaymentFailedEmail,
  sendCancellationEmail,
};
