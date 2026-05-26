const mongoose = require("mongoose");
const Success = require("../models/success.model");
const User = require("../models/user.model");
const { sendBookingConfirmation } = require("../services/mail.service");

const findUserForConfirmation = async (identifier) => {
  if (mongoose.isValidObjectId(identifier)) {
    return User.findById(identifier).lean().exec();
  }

  return User.findOne({ email: String(identifier).toLowerCase() }).lean().exec();
};

const createSuccess = async (req, res) => {
  const success = await Success.findOneAndUpdate(
    { razorpay_order_id: req.body.razorpay_order_id },
    { $setOnInsert: req.body },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const user = await findUserForConfirmation(req.body.user);

  sendBookingConfirmation({
    user,
    orderId: req.body.razorpay_order_id,
  }).catch((error) =>
    console.error("Booking confirmation email failed:", error.message)
  );

  return res.status(201).send({ success });
};

module.exports = {
  createSuccess,
};
