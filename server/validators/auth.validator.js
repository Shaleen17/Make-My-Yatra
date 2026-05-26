const { z } = require("zod");

const purposeSchema = z
  .enum(["login", "email_verification", "password_reset"])
  .default("login");

const emailOrPhoneSchema = z
  .object({
    email: z.string().email("A valid email address is required.").optional(),
    phone: z.string().email("A valid email address is required.").optional(),
  })
  .refine((value) => value.email || value.phone, {
    message: "Email is required.",
    path: ["email"],
  });

const sendOtpSchema = z.object({
  body: emailOrPhoneSchema.extend({
    purpose: purposeSchema.optional(),
  }),
});

const verifyOtpSchema = z.object({
  body: emailOrPhoneSchema.extend({
    purpose: purposeSchema.optional(),
    hash: z.string().min(8).optional(),
    requestId: z.string().min(8).optional(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit code."),
  }),
});

const resendOtpSchema = z.object({
  body: emailOrPhoneSchema.extend({
    purpose: purposeSchema.optional(),
    hash: z.string().min(8).optional(),
    requestId: z.string().min(8).optional(),
  }),
});

const forgotPasswordSchema = z.object({
  body: emailOrPhoneSchema,
});

const resetPasswordSchema = z.object({
  body: emailOrPhoneSchema.extend({
    hash: z.string().min(8).optional(),
    requestId: z.string().min(8).optional(),
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6 digit code."),
    password: z.string().min(8, "Password must be at least 8 characters."),
  }),
});

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters."),
    email: z.string().trim().email("A valid email address is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    mobile: z
      .union([z.string(), z.number()])
      .optional()
      .transform((value) =>
        value === undefined || value === null || value === "" ? undefined : String(value)
      )
      .refine((value) => value === undefined || /^[0-9]{10}$/.test(value), {
        message: "Mobile number must be 10 digits.",
      }),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("A valid email address is required."),
    password: z.string().min(1, "Password is required."),
  }),
});

const refreshSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().optional(),
    })
    .optional(),
});

module.exports = {
  sendOtpSchema,
  verifyOtpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  registerSchema,
  loginSchema,
  refreshSchema,
};
