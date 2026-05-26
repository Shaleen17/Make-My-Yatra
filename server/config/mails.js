const nodemailer = require("nodemailer");
const { env } = require("./env");

const createTransporter = () => {
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

module.exports = createTransporter();
