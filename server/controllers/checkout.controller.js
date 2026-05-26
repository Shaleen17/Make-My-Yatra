const Checkout = require("../models/checkout.model");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const createCheckout = async (req, res) => {
  if (req.body.idempotencyKey) {
    const item = await Checkout.findOneAndUpdate(
      { idempotencyKey: req.body.idempotencyKey, deletedAt: null },
      { $setOnInsert: req.body },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(201).send(item);
  }

  const item = await Checkout.create(req.body);
  return res.status(201).send(item);
};

const getCheckoutsByUser = async (req, res) => {
  const pagination = getPagination(req.query);
  const filter = { user: req.params.name, deletedAt: null };
  const query = Checkout.find(filter)
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const [result, total] = await Promise.all([
    query.exec(),
    Checkout.countDocuments(filter),
  ]);

  if (!pagination.isPaginated) {
    return res.status(200).json(result);
  }

  return res.status(200).json({
    data: result,
    pagination: buildPaginationMeta({ ...pagination, total }),
  });
};

module.exports = {
  createCheckout,
  getCheckoutsByUser,
};
