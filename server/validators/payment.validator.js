const { z } = require("zod");

const createPaymentOrderSchema = z.object({
  body: z
    .object({
      bookingId: z.string().min(1).optional(),
      idempotencyKey: z.string().min(8).optional(),
      // Legacy clients may still send price. It is ignored for amount calculation.
      price: z.coerce.number().positive().optional(),
      params: z
        .object({
          price: z.coerce.number().positive().optional(),
        })
        .optional(),
    })
    .passthrough(),
});

const verifyPaymentSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1).optional(),
    razorpay_order_id: z.string().min(1),
    razorpay_payment_id: z.string().min(1),
    razorpay_signature: z.string().min(1),
  }),
});

const paymentFailureSchema = z.object({
  body: z.object({
    bookingId: z.string().min(1).optional(),
    razorpay_order_id: z.string().min(1).optional(),
    reason: z.string().optional(),
  }),
});

module.exports = {
  createPaymentOrderSchema,
  verifyPaymentSchema,
  paymentFailureSchema,
};
