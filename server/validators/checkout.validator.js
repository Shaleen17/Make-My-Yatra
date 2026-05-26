const { z } = require("zod");
const { nameParamSchema } = require("./common.validator");

const createCheckoutSchema = z.object({
  body: z
    .object({
      price: z
        .object({
          base_fare: z.coerce.number().nonnegative(),
          surcharges: z.coerce.number().nonnegative(),
        })
        .optional(),
      date: z.string().optional(),
      user: z.string().min(1),
      status: z
        .enum(["draft", "pending", "confirmed", "cancelled", "expired"])
        .optional(),
      idempotencyKey: z.string().min(8).optional(),
    })
    .passthrough(),
});

module.exports = {
  createCheckoutSchema,
  getCheckoutsByUserSchema: nameParamSchema,
};
