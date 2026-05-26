const axios = require("axios");
const nodemailer = require("nodemailer");
const { env } = require("../config/env");
const EmailLog = require("../models/emailLog.model");
const logger = require("../utils/logger");
const {
  otpVerificationTemplate,
  passwordResetOtpTemplate,
  bookingConfirmationTemplate,
} = require("../templates/emailTemplates");

const createSmtpTransporter = () => {
  if (!env.smtp.host) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth:
      env.smtp.username && env.smtp.password
        ? {
            user: env.smtp.username,
            pass: env.smtp.password,
          }
        : undefined,
  });
};

const getEmailHealth = () => ({
  provider: env.emailProvider,
  configured:
    env.emailProvider === "brevo"
      ? Boolean(env.brevo.apiKey && env.brevo.senderEmail)
      : Boolean(env.smtp.host || env.emailProvider === "json"),
  senderConfigured: Boolean(env.brevo.senderEmail || env.smtp.from),
  brevoConfigured: Boolean(env.brevo.apiKey && env.brevo.senderEmail),
  smtpFallbackConfigured: Boolean(env.smtp.host),
});

const sendViaBrevo = async ({ to, subject, text, html }) => {
  if (!env.brevo.apiKey || !env.brevo.senderEmail) {
    throw new Error("Brevo email provider is not configured.");
  }

  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: env.brevo.senderEmail,
        name: env.brevo.senderName,
      },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    },
    {
      headers: {
        accept: "application/json",
        "api-key": env.brevo.apiKey,
        "content-type": "application/json",
      },
      timeout: 10000,
    }
  );

  return {
    provider: "brevo",
    messageId: response.data?.messageId,
  };
};

const sendViaSmtp = async ({ to, subject, text, html }) => {
  const transporter = createSmtpTransporter();
  const response = await transporter.sendMail({
    from: env.smtp.from || env.brevo.senderEmail,
    to,
    subject,
    text,
    html,
  });

  return {
    provider: env.smtp.host ? "smtp" : "json",
    messageId: response.messageId,
  };
};

const sendEmail = async (message) => {
  let log;
  if (!env.isTest) {
    try {
      log = await EmailLog.create({
        provider: env.emailProvider,
        to: message.to,
        subject: message.subject,
        purpose: message.purpose,
        status: "queued",
      });
    } catch (error) {
      logger.warn({ err: error }, "email log create failed");
    }
  }

  if (env.emailProvider === "brevo") {
    try {
      const result = await sendViaBrevo(message);
      if (log) {
        log.status = "sent";
        log.messageId = result.messageId;
        await log.save();
      }
      return result;
    } catch (error) {
      if (!env.smtp.host) {
        if (log) {
          log.status = "failed";
          log.error = error.message;
          await log.save();
        }
        throw error;
      }

      const result = await sendViaSmtp(message);
      if (log) {
        log.status = "sent";
        log.provider = result.provider;
        log.messageId = result.messageId;
        await log.save();
      }
      return result;
    }
  }

  const result = await sendViaSmtp(message);
  if (log) {
    log.status = "sent";
    log.provider = result.provider;
    log.messageId = result.messageId;
    await log.save();
  }
  return result;
};

const sendOtpEmail = ({ to, otp, purpose = "login" }) => {
  const template =
    purpose === "password_reset"
      ? passwordResetOtpTemplate({ otp, minutes: env.otpTtlMinutes })
      : otpVerificationTemplate({ otp, minutes: env.otpTtlMinutes });

  return sendEmail({
    to,
    purpose,
    ...template,
  });
};

const sendBookingConfirmationEmail = ({ user, orderId }) => {
  if (!user?.email) {
    return Promise.resolve();
  }

  return sendEmail({
    to: user.email,
    purpose: "booking_confirmation",
    ...bookingConfirmationTemplate({ user, orderId }),
  });
};

module.exports = {
  sendEmail,
  sendOtpEmail,
  sendBookingConfirmationEmail,
  getEmailHealth,
};
