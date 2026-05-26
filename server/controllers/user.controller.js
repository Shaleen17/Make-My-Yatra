const mongoose = require("mongoose");
const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { getPagination, buildPaginationMeta } = require("../utils/pagination");

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  return res.status(201).send(user);
};

const getUsers = async (req, res) => {
  const pagination = getPagination(req.query);
  const filter = { deletedAt: null };
  const query = User.find(filter)
    .sort({ createdAt: -1 })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .lean();

  const [user, total] = await Promise.all([
    query.exec(),
    User.countDocuments(filter),
  ]);

  return res.status(200).send({
    user,
    ...(pagination.isPaginated
      ? { pagination: buildPaginationMeta({ ...pagination, total }) }
      : {}),
  });
};

const getUserById = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new AppError("Invalid user id.", 400);
  }

  const user = await User.findOne({
    _id: req.params.id,
    deletedAt: null,
  })
    .lean()
    .exec();

  return res.status(200).send({ user: user ? [user] : [] });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
