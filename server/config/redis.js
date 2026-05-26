const Redis = require("ioredis");
const { env } = require("./env");
const logger = require("../utils/logger");

let redisClient;

const getRedisClient = () => {
  if (!env.redisEnabled || !env.redisUrl) {
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(env.redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
    });

    redisClient.on("error", (error) => {
      logger.warn({ err: error }, "redis connection error");
    });
  }

  return redisClient;
};

const connectRedis = async () => {
  const client = getRedisClient();
  if (!client) return null;
  if (client.status === "wait") {
    await client.connect();
  }
  return client;
};

module.exports = {
  getRedisClient,
  connectRedis,
};
