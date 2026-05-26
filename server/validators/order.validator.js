const { z } = require("zod");
const { nameParamSchema } = require("./common.validator");

const createOrderSchema = z.object({
  body: z
    .object({
      user: z.string().optional(),
      flight_date: z.string().optional(),
      flight_status: z.string().optional(),
      status: z
        .enum(["draft", "pending", "confirmed", "cancelled", "failed"])
        .optional(),
      idempotencyKey: z.string().min(8).optional(),
    })
    .passthrough(),
});

module.exports = {
  createOrderSchema,
  getOrdersByUserSchema: nameParamSchema,
};
