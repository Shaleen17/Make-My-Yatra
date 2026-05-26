const { z } = require("zod");
const { searchFlights } = require("../services/flightSearch.service");

const flightSearchQuerySchema = z.object({
  from: z.string().trim().min(3).max(8),
  to: z.string().trim().min(3).max(8),
  departureDate: z.string().trim().optional(),
  date: z.string().trim().optional(),
  outboundDate: z.string().trim().optional(),
  returnDate: z.string().trim().optional(),
  tripType: z.string().trim().optional(),
  class: z.string().trim().optional(),
  cabinClass: z.string().trim().optional(),
  passengers: z.coerce.number().int().positive().max(9).optional(),
  travellers: z.coerce.number().int().positive().max(9).optional(),
  adults: z.coerce.number().int().positive().max(9).optional(),
  currency: z.string().trim().length(3).optional(),
});

const searchFlightOffers = async (req, res) => {
  const query = flightSearchQuerySchema.parse(req.query);
  const result = await searchFlights(query);

  return res.json({
    success: true,
    count: result.flights.length,
    ...result,
  });
};

module.exports = {
  searchFlightOffers,
};
