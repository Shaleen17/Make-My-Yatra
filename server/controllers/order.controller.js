const Order = require("../models/order.model");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const createOrder = async (req, res) => {
  if (req.body.idempotencyKey) {
    const order = await Order.findOneAndUpdate(
      { idempotencyKey: req.body.idempotencyKey, deletedAt: null },
      { $setOnInsert: req.body },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(201).send(order);
  }

  const order = await Order.create(req.body);
  return res.status(201).send(order);
};

const getOrdersByUser = async (req, res) => {
  const pagination = getPagination(req.query);
  const filter = { user: req.params.name, deletedAt: null };
  const query = Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const [result, total] = await Promise.all([
    query.exec(),
    Order.countDocuments(filter),
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
  createOrder,
  getOrdersByUser,
};
