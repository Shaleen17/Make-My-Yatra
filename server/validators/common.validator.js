const { z } = require("zod");

const mongoIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

const nameParamSchema = z.object({
  params: z.object({
    name: z.string().min(1),
  }),
  query: z
    .object({
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().max(100).optional(),
    })
    .optional(),
});

const paginationQuerySchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().max(100).optional(),
    })
    .optional(),
});

module.exports = {
  mongoIdParamSchema,
  nameParamSchema,
  paginationQuerySchema,
};
