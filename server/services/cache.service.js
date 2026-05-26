const { env } = require("../config/env");
const { getRedisClient } = require("../config/redis");

const memoryCache = new Map();

const nowSeconds = () => Math.floor(Date.now() / 1000);

const getMemory = (key) => {
  const item = memoryCache.get(key);
  if (!item) return null;
  if (item.expiresAt <= nowSeconds()) {
    memoryCache.delete(key);
    return null;
  }
  return item.value;
};

const setMemory = (key, value, ttlSeconds) => {
  memoryCache.set(key, {
    value,
    expiresAt: nowSeconds() + ttlSeconds,
  });
};

const getCache = async (key) => {
  const redis = getRedisClient();
  if (redis?.status === "ready") {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  return getMemory(key);
};

const setCache = async (key, value, ttlSeconds = env.cacheTtlSeconds) => {
  const redis = getRedisClient();
  if (redis?.status === "ready") {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return;
  }

  setMemory(key, value, ttlSeconds);
};

const deleteCacheByPattern = async (pattern) => {
  const redis = getRedisClient();
  if (redis?.status === "ready") {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(keys);
    }
    return;
  }

  const regex = new RegExp(`^${pattern.replace(/\*/g, ".*")}$`);
  [...memoryCache.keys()].forEach((key) => {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  });
};

const invalidateCatalogCache = () =>
  Promise.all([
    deleteCacheByPattern("search:*"),
    deleteCacheByPattern("destinations:*"),
    deleteCacheByPattern("availability:*"),
  ]);

module.exports = {
  getCache,
  setCache,
  deleteCacheByPattern,
  invalidateCatalogCache,
};
