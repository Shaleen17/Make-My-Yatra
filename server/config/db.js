const mongoose = require("mongoose");
const { env } = require("./env");

mongoose.set("strictQuery", true);

const connect = () => {
  if (!env.mongoUri) {
    throw new Error("Missing MongoDB connection string. Set MONGO_URI in .env.");
  }

  return mongoose.connect(env.mongoUri, {
    autoIndex: !env.isProduction,
  });
};

module.exports = connect;
