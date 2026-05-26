const {
  sendBookingConfirmationEmail,
  sendOtpEmail,
} = require("./email.service");

const sendBookingConfirmation = ({ user, orderId }) =>
  sendBookingConfirmationEmail({ user, orderId });

module.exports = {
  sendBookingConfirmation,
  sendOtpEmail,
};
