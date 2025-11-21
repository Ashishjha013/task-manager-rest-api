const { client } = require('../config/redis');

const DEFAULT_TTL = Number(process.env.REDIS_TTL_SECONDS || 300); // 5 mins

const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  try {
    await client.set(key, JSON.stringify(data), { EX: ttl });
  } catch (err) {
    console.error('Redis set error: ', err.message);
  }
};

const getCache = async (key) => {
  try {
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
