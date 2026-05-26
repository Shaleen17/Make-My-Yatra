const mongoose = require("mongoose");
const { env } = require("./env");

mongoose.set("strictQuery", true);

const connect = async () => {
  if (!env.mongoUri) {
    throw new Error("Missing MongoDB connection string. Set MONGO_URI in .env.");
  }

  try {
    return await mongoose.connect(env.mongoUri, {
      autoIndex: !env.isProduction,
    });
  } catch (error) {
    const canUseLocalFallback =
      !env.isProductionLike && String(env.mongoUri).startsWith("mongodb+srv://");

    if (!canUseLocalFallback) {
      throw error;
    }

    const localMongoUri = "mongodb://127.0.0.1:27017/make-my-yatra";
    console.warn(
      `Remote MongoDB connection failed in development. Falling back to ${localMongoUri}.`
    );

    return mongoose.connect(localMongoUri, {
      autoIndex: true,
    });
  }
};

module.exports = connect;
