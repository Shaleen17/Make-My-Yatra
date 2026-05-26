const { z } = require("zod");

const guestsSchema = z
  .object({
    adults: z.coerce.number().int().min(0).optional(),
    children: z.coerce.number().int().min(0).optional(),
    infants: z.coerce.number().int().min(0).optional(),
  })
  .optional();

const createBookingSchema = z.object({
  body: z
    .object({
      user: z.string().optional(),
      userEmail: z.string().email().optional(),
      email: z.string().email().optional(),
      userName: z.string().optional(),
      bookingType: z
        .enum(["flight", "accommodation", "package", "legacy"])
        .optional(),
      accommodation: z
        .object({
          slug: z.string().min(1).optional(),
          name: z.string().optional(),
        })
        .optional(),
      package: z
        .object({
          slug: z.string().min(1).optional(),
          name: z.string().optional(),
        })
        .optional(),
      destination: z.string().optional(),
      checkIn: z.string().optional(),
      checkOut: z.string().optional(),
      yatraDate: z.string().optional(),
      guests: guestsSchema,
      selectedRoom: z
        .object({
          roomTypeId: z.string().optional(),
          name: z.string().optional(),
          quantity: z.coerce.number().int().positive().optional(),
        })
        .optional(),
      selectedPackage: z
        .object({
          packageId: z.string().optional(),
          name: z.string().optional(),
          quantity: z.coerce.number().int().positive().optional(),
        })
        .optional(),
      flight: z.unknown().optional(),
      metadata: z.unknown().optional(),
      idempotencyKey: z.string().min(8).optional(),
    })
    .passthrough(),
});

const myBookingsSchema = z.object({
  query: z
    .object({
      user: z.string().optional(),
      email: z.string().email().optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().max(100).optional(),
    })
    .optional(),
});

const bookingIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      reason: z.string().optional(),
    })
    .optional(),
});

module.exports = {
  createBookingSchema,
  myBookingsSchema,
  bookingIdParamSchema,
  cancelBookingSchema,
};
