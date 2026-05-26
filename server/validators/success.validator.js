const { z } = require("zod");

const createSuccessSchema = z.object({
  body: z
    .object({
      razorpay_order_id: z.string().min(1),
      razorpay_payment_id: z.string().optional(),
      user: z.string().min(1),
      status: z.enum(["pending", "confirmed", "failed", "refunded"]).optional(),
    })
    .passthrough(),
});

module.exports = {
  createSuccessSchema,
};
