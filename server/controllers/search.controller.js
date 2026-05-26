const Accommodation = require("../models/accommodation.model");
const Inventory = require("../models/inventory.model");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");
const { getCache, setCache } = require("../services/cache.service");

const buildSearchFilter = (query) => {
  const filter = { active: true, deletedAt: null };

  if (query.q) {
    filter.$or = [
      { name: { $regex: query.q, $options: "i" } },
      { destination: { $regex: query.q, $options: "i" } },
      { category: { $regex: query.q, $options: "i" } },
      { address: { $regex: query.q, $options: "i" } },
    ];
  }

  if (query.destination || query.city) {
    filter.destination = {
      $regex: query.destination || query.city,
      $options: "i",
    };
  }

  if (query.amenities) {
    const amenities = String(query.amenities)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    filter.tags = { $all: amenities };
  }

  if (query.minPrice || query.maxPrice) {
    filter.roomTypes = {
      $elemMatch: {
        active: true,
        ...(query.minPrice ? { baseAmount: { $gte: Number(query.minPrice) } } : {}),
        ...(query.maxPrice ? { baseAmount: { $lte: Number(query.maxPrice) } } : {}),
      },
    };
  }

  return filter;
};

const getAvailableAccommodationSlugs = async ({ checkIn, checkOut, guests }) => {
  if (!checkIn || !checkOut) return null;

  const rows = await Inventory.aggregate([
    {
      $match: {
        date: {
          $gte: new Date(checkIn),
          $lt: new Date(checkOut),
        },
      },
    },
    {
      $addFields: {
        availableUnits: {
          $subtract: ["$totalUnits", { $add: ["$reservedUnits", "$soldUnits"] }],
        },
      },
    },
    { $match: { availableUnits: { $gt: 0 } } },
    { $group: { _id: "$accommodationSlug" } },
  ]).exec();

  return rows.map((row) => row._id);
};

const searchAccommodations = async (req, res) => {
  const cacheKey = `search:accommodations:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const pagination = getPagination(req.query);
  const filter = buildSearchFilter(req.query);
  const availableSlugs = await getAvailableAccommodationSlugs(req.query);

  if (availableSlugs) {
    filter.slug = { $in: availableSlugs };
  }

  const sort =
    req.query.sort === "price_asc"
      ? { "roomTypes.baseAmount": 1 }
      : req.query.sort === "price_desc"
      ? { "roomTypes.baseAmount": -1 }
      : { name: 1 };

  const [data, total] = await Promise.all([
    Accommodation.find(filter)
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean()
      .exec(),
    Accommodation.countDocuments(filter),
  ]);

  const response = {
    success: true,
    data,
    pagination: buildPaginationMeta({ ...pagination, total }),
  };

  await setCache(cacheKey, response);
  return res.json(response);
};

const searchDestinations = async (req, res) => {
  const cacheKey = `destinations:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const match = {
    active: true,
    deletedAt: null,
    ...(req.query.q
      ? { destination: { $regex: req.query.q, $options: "i" } }
      : {}),
  };

  const data = await Accommodation.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$destination",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1, _id: 1 } },
    { $limit: Number(req.query.limit || 20) },
  ]).exec();

  const response = {
    success: true,
    data: data.map((item) => ({
      destination: item._id,
      count: item.count,
    })),
  };

  await setCache(cacheKey, response);
  return res.json(response);
};

const getAvailabilitySnapshot = async (req, res) => {
  const cacheKey = `availability:${JSON.stringify(req.query)}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const rows = await Inventory.find({
    ...(req.query.accommodationSlug
      ? { accommodationSlug: req.query.accommodationSlug }
      : {}),
    ...(req.query.roomTypeId ? { roomTypeId: req.query.roomTypeId } : {}),
    ...(req.query.from || req.query.to
      ? {
          date: {
            ...(req.query.from ? { $gte: new Date(req.query.from) } : {}),
            ...(req.query.to ? { $lte: new Date(req.query.to) } : {}),
          },
        }
      : {}),
  })
    .sort({ date: 1 })
    .lean()
    .exec();

  const response = { success: true, data: rows };
  await setCache(cacheKey, response, 60);
  return res.json(response);
};

module.exports = {
  searchAccommodations,
  searchDestinations,
  getAvailabilitySnapshot,
};
