const dotenv = require("dotenv");
const path = require("path");
const { z } = require("zod");
const { getEnvironmentSettings } = require("./environments");

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const normalizedEnvironment =
  process.env.NODE_ENV || process.env.CURRENT_ENVIRONMENT || "development";

const booleanFromEnv = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return ["true", "1", "yes", "y"].includes(String(value).toLowerCase());
};

const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
  CURRENT_ENVIRONMENT: z.string().optional(),
  PORT: z.coerce.number().int().positive().optional(),
  API_PORT: z.coerce.number().int().positive().optional(),
  SERVER_PORT: z.coerce.number().int().positive().optional(),
  MONGO_URI: z.string().optional(),
  mongo: z.string().optional(),
  FRONTEND_URL: z.string().url().optional(),
  CLIENT_URL: z.string().url().optional(),
  REACT_APP_FRONTEND_URL: z.string().url().optional(),
  CLIENT_ORIGINS: z.string().optional(),
  BODY_LIMIT: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  JWT_SECRET: z.string().optional(),
  JWT_EXPIRES_IN: z.string().optional(),
  REFRESH_TOKEN_SECRET: z.string().optional(),
  REFRESH_TOKEN_EXPIRES_IN: z.string().optional(),
  ACCESS_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().optional(),
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().optional(),
  EMAIL_PROVIDER: z.enum(["brevo", "smtp", "json"]).optional(),
  BREVO_API_KEY: z.string().optional(),
  BREVO_SENDER_EMAIL: z.string().email().optional(),
  BREVO_SENDER_NAME: z.string().optional(),
  OTP_SECRET: z.string().optional(),
  OTP_TTL_MINUTES: z.coerce.number().int().positive().optional(),
  OTP_EXPIRES_MINUTES: z.coerce.number().int().positive().optional(),
  OTP_RESEND_COOLDOWN_SECONDS: z.coerce.number().int().positive().optional(),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().optional(),
  OTP_MAX_RESENDS: z.coerce.number().int().nonnegative().optional(),
  OTP_LOCK_MINUTES: z.coerce.number().int().positive().optional(),
  EXPOSE_OTP_IN_RESPONSE: z.string().optional(),
  COOKIE_SECRET: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().optional(),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().optional(),
  PAYMENT_RATE_LIMIT_MAX: z.coerce.number().int().positive().optional(),
  REDIS_URL: z.string().optional(),
  REDIS_ENABLED: z.string().optional(),
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().optional(),
  JOBS_ENABLED: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  RAZORPAY_CURRENCY: z.string().optional(),
  GOOGLE_FLIGHT_API_KEY: z.string().optional(),
  Google_Flight_API_KEY: z.string().optional(),
  SERPAPI_API_KEY: z.string().optional(),
  FLIGHTS_API_KEY: z.string().optional(),
  FLIGHT_API_KEY: z.string().optional(),
  GOOGLE_FLIGHT_API_PROVIDER: z.string().optional(),
  GOOGLE_FLIGHT_API_BASE_URL: z.string().url().optional(),
  FLIGHTS_API_BASE_URL: z.string().url().optional(),
  PAYMENT_CURRENCY: z.string().optional(),
  DEFAULT_BOOKING_AMOUNT: z.coerce.number().positive().optional(),
  TRUST_PROXY: z.string().optional(),
});

const parsed = envSchema.safeParse({
  ...process.env,
  NODE_ENV: normalizedEnvironment,
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration: ${details}`);
}

const rawEnv = parsed.data;
const runtimeSettings = getEnvironmentSettings(rawEnv.NODE_ENV);
const frontendUrl =
  rawEnv.CLIENT_URL ||
  rawEnv.FRONTEND_URL ||
  rawEnv.REACT_APP_FRONTEND_URL ||
  "http://localhost:3000";
const clientOrigins = parseOrigins(rawEnv.CLIENT_ORIGINS || frontendUrl);
const isProductionLike = ["production", "staging"].includes(rawEnv.NODE_ENV);

const requiredInProduction = [
  ["MONGO_URI", rawEnv.MONGO_URI || rawEnv.mongo],
  ["JWT_SECRET", rawEnv.JWT_SECRET],
  ["REFRESH_TOKEN_SECRET", rawEnv.REFRESH_TOKEN_SECRET],
  ["OTP_SECRET", rawEnv.OTP_SECRET],
  ["BREVO_API_KEY", rawEnv.EMAIL_PROVIDER === "smtp" ? true : rawEnv.BREVO_API_KEY],
  [
    "BREVO_SENDER_EMAIL",
    rawEnv.EMAIL_PROVIDER === "smtp" ? true : rawEnv.BREVO_SENDER_EMAIL,
  ],
  ["RAZORPAY_KEY_ID", rawEnv.RAZORPAY_KEY_ID],
  ["RAZORPAY_KEY_SECRET", rawEnv.RAZORPAY_KEY_SECRET],
  ["RAZORPAY_WEBHOOK_SECRET", rawEnv.RAZORPAY_WEBHOOK_SECRET],
];

if (isProductionLike) {
  const missing = requiredInProduction
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing required ${rawEnv.NODE_ENV} environment variables: ${missing.join(
        ", "
      )}`
    );
  }
}

const env = {
  nodeEnv: rawEnv.NODE_ENV,
  isTest: rawEnv.NODE_ENV === "test",
  isProduction: rawEnv.NODE_ENV === "production",
  isProductionLike,
  port: rawEnv.SERVER_PORT || rawEnv.API_PORT || rawEnv.PORT || 2345,
  mongoUri: rawEnv.MONGO_URI || rawEnv.mongo,
  frontendUrl,
  clientOrigins,
  bodyLimit: rawEnv.BODY_LIMIT || "1mb",
  logLevel: rawEnv.LOG_LEVEL || (rawEnv.NODE_ENV === "production" ? "info" : "debug"),
  sentryDsn: rawEnv.SENTRY_DSN,
  jwtSecret: rawEnv.JWT_SECRET || "development-jwt-secret-change-me",
  jwtExpiresIn: rawEnv.JWT_EXPIRES_IN || "15m",
  refreshTokenSecret:
    rawEnv.REFRESH_TOKEN_SECRET ||
    "development-refresh-token-secret-change-me",
  refreshTokenExpiresIn: rawEnv.REFRESH_TOKEN_EXPIRES_IN || "7d",
  accessTokenCookieMaxAgeMs:
    rawEnv.ACCESS_TOKEN_COOKIE_MAX_AGE_MS || 15 * 60 * 1000,
  refreshTokenCookieMaxAgeMs:
    rawEnv.REFRESH_TOKEN_COOKIE_MAX_AGE_MS || 7 * 24 * 60 * 60 * 1000,
  emailProvider: rawEnv.EMAIL_PROVIDER || "brevo",
  brevo: {
    apiKey: rawEnv.BREVO_API_KEY,
    senderEmail: rawEnv.BREVO_SENDER_EMAIL || rawEnv.SMTP_FROM,
    senderName: rawEnv.BREVO_SENDER_NAME || "Make My Yatra",
  },
  otpSecret: rawEnv.OTP_SECRET || "development-otp-secret-change-me",
  otpTtlMinutes: rawEnv.OTP_EXPIRES_MINUTES || rawEnv.OTP_TTL_MINUTES || 10,
  otpResendCooldownSeconds: rawEnv.OTP_RESEND_COOLDOWN_SECONDS || 60,
  otpMaxAttempts: rawEnv.OTP_MAX_ATTEMPTS || 5,
  otpMaxResends: rawEnv.OTP_MAX_RESENDS ?? 3,
  otpLockMinutes: rawEnv.OTP_LOCK_MINUTES || 15,
  exposeOtpInResponse: false,
  cookieSecret: rawEnv.COOKIE_SECRET || rawEnv.JWT_SECRET || "dev-cookie-secret",
  cookieDomain: rawEnv.COOKIE_DOMAIN,
  cookieSecure: runtimeSettings.cookieSecure,
  cookieSameSite: runtimeSettings.cookieSameSite,
  rateLimitWindowMs: rawEnv.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  rateLimitMax: rawEnv.RATE_LIMIT_MAX || 300,
  authRateLimitMax: rawEnv.AUTH_RATE_LIMIT_MAX || 30,
  paymentRateLimitMax: rawEnv.PAYMENT_RATE_LIMIT_MAX || 60,
  redisUrl: rawEnv.REDIS_URL,
  redisEnabled: booleanFromEnv(rawEnv.REDIS_ENABLED, Boolean(rawEnv.REDIS_URL)),
  cacheTtlSeconds: rawEnv.CACHE_TTL_SECONDS || 300,
  jobsEnabled: booleanFromEnv(rawEnv.JOBS_ENABLED, Boolean(rawEnv.REDIS_URL)),
  logRequests: runtimeSettings.logRequests,
  logFormat: runtimeSettings.logFormat,
  smtp: {
    host: rawEnv.SMTP_HOST,
    port: rawEnv.SMTP_PORT || 2525,
    username: rawEnv.SMTP_USERNAME,
    password: rawEnv.SMTP_PASSWORD,
    from: rawEnv.SMTP_FROM || "no-reply@tirthyatra.local",
  },
  razorpay: {
    keyId: rawEnv.RAZORPAY_KEY_ID,
    keySecret: rawEnv.RAZORPAY_KEY_SECRET,
    webhookSecret: rawEnv.RAZORPAY_WEBHOOK_SECRET,
    currency: rawEnv.PAYMENT_CURRENCY || rawEnv.RAZORPAY_CURRENCY || "INR",
  },
  flightSearch: {
    provider: ["auto", "serpapi", "flightsapi", "flightapi"].includes(
      rawEnv.GOOGLE_FLIGHT_API_PROVIDER
    )
      ? rawEnv.GOOGLE_FLIGHT_API_PROVIDER
      : "auto",
    apiKey:
      rawEnv.GOOGLE_FLIGHT_API_KEY ||
      rawEnv.Google_Flight_API_KEY ||
      rawEnv.FLIGHT_API_KEY ||
      rawEnv.FLIGHTS_API_KEY ||
      rawEnv.SERPAPI_API_KEY,
    serpApiKey:
      rawEnv.SERPAPI_API_KEY ||
      rawEnv.GOOGLE_FLIGHT_API_KEY ||
      rawEnv.Google_Flight_API_KEY,
    flightsApiKey:
      rawEnv.FLIGHTS_API_KEY ||
      rawEnv.FLIGHT_API_KEY ||
      rawEnv.GOOGLE_FLIGHT_API_KEY ||
      rawEnv.Google_Flight_API_KEY,
    flightsApiBaseUrl:
      rawEnv.FLIGHTS_API_BASE_URL ||
      rawEnv.GOOGLE_FLIGHT_API_BASE_URL ||
      "https://api.flightsapi.io/flights",
  },
  defaultBookingAmount: rawEnv.DEFAULT_BOOKING_AMOUNT || 5305,
  trustProxy: booleanFromEnv(rawEnv.TRUST_PROXY, isProductionLike),
};

module.exports = {
  env,
};
