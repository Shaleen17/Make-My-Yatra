const { z } = require("zod");
const { mongoIdParamSchema, paginationQuerySchema } = require("./common.validator");

const createUserSchema = z.object({
  body: z
    .object({
      id: z.string().optional(),
      name: z.string().trim().min(1),
      email: z.string().trim().email(),
      password: z.string().min(8),
      mobile: z.union([z.string(), z.number()]).optional(),
      role: z.enum(["traveller", "admin"]).optional(),
    })
    .passthrough(),
});

module.exports = {
  createUserSchema,
  getUsersSchema: paginationQuerySchema,
  getUserByIdSchema: mongoIdParamSchema,
};
