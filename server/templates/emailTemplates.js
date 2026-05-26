const escapeHtml = (value) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const baseTemplate = ({ title, preview, body }) => {
  const safeTitle = escapeHtml(title);

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;background:#f6f2ec;font-family:Arial,sans-serif;color:#2c1810;">
    <span style="display:none;opacity:0;visibility:hidden;">${escapeHtml(
      preview
    )}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f2ec;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #efe3d4;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background:#c0392b;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;line-height:1.3;">Make My Yatra</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h2 style="margin:0 0 16px;font-size:20px;line-height:1.35;color:#2c1810;">${safeTitle}</h2>
                ${body}
                <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#7b685c;">If you did not request this, you can safely ignore this email.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

const otpBlock = ({ otp, minutes, action }) => `
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4e3a30;">Use the verification code below to ${escapeHtml(
    action
  )}. It expires in ${escapeHtml(minutes)} minutes.</p>
  <div style="margin:24px 0;padding:18px 20px;background:#faf7f2;border:1px solid #efe3d4;border-radius:8px;text-align:center;">
    <div style="font-size:32px;letter-spacing:8px;font-weight:700;color:#c0392b;">${escapeHtml(
      otp
    )}</div>
  </div>`;

const otpVerificationTemplate = ({ otp, minutes }) => ({
  subject: "Your Make My Yatra verification code",
  text: `Your Make My Yatra verification code is ${otp}. It expires in ${minutes} minutes.`,
  html: baseTemplate({
    title: "Your verification code",
    preview: "Use this OTP to verify your Make My Yatra login.",
    body: otpBlock({ otp, minutes, action: "continue your login" }),
  }),
});

const passwordResetOtpTemplate = ({ otp, minutes }) => ({
  subject: "Reset your Make My Yatra password",
  text: `Your Make My Yatra password reset code is ${otp}. It expires in ${minutes} minutes.`,
  html: baseTemplate({
    title: "Reset your password",
    preview: "Use this OTP to reset your Make My Yatra password.",
    body: otpBlock({ otp, minutes, action: "reset your password" }),
  }),
});

const bookingConfirmationTemplate = ({ user, orderId }) => ({
  subject: `Booking confirmed for ${user?.name || "traveller"}`,
  text: `Welcome to Make My Yatra. Your booking is confirmed. Order id: ${orderId}`,
  html: baseTemplate({
    title: "Booking confirmed",
    preview: "Your Make My Yatra booking is confirmed.",
    body: `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#4e3a30;">Namaste ${escapeHtml(
      user?.name || "traveller"
    )}, your booking is confirmed.</p><p style="margin:0;font-size:15px;line-height:1.6;color:#4e3a30;">Order id: <strong>${escapeHtml(
      orderId
    )}</strong></p>`,
  }),
});

module.exports = {
  otpVerificationTemplate,
  passwordResetOtpTemplate,
  bookingConfirmationTemplate,
};
