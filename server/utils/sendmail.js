const sendEmail = require("./sendEmail");

module.exports = ({ from, to, subject, text, html }) =>
  sendEmail({
    from,
    to,
    subject,
    text,
    html,
  });
