const { getRedisClient } = require('../config/redis');

const DEFAULT_TTL = Number(process.env.REDIS_TTL_SECONDS || 300); // 5 mins

const getClient = () => {
  const client = getRedisClient();
  if (!client || !client.isOpen) return null;
  return client;
};

const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    const client = getClient();
    if (!client) return;
    await client.set(key, JSON.stringify(data), { EX: ttl });
  } catch (err) {
    console.error('Redis set error: ', err.message);
  }
};

const getCache = async (key) => {
  try {
    const client = getClient();
    if (!client) return null;

    const cached = await client.get(key);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch (err) {
    console.error('Redis get error: ', err.message);
    return null;
  }
};

const delCache = async (key) => {
  try {
    const client = getClient();
    if (!client) return;
    await client.del(key);
  } catch (err) {
    console.error('Redis del error: ', err.message);
  }
};

module.exports = {
  setCache,
  getCache,
  delCache,
};
