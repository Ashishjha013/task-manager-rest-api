const redis = require('redis');

let client;

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn('REDIS_URL is not set. Running without Redis cache.');
    return null;
  }

  try {
    client = redis.createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: () => false,
      },
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
    });

    await client.connect();
    console.log('Redis connected successfully');
    return client;
  } catch (error) {
    console.error('Redis connection failed:', error.message);
    client = null;
    return null;
  }
};

module.exports = {
  connectRedis,
  getRedisClient: () => client,
};

