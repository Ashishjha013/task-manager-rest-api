const redis = require('redis');
const { log } = require('winston');

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('Redis connected successfully');
  }
};

module.exports = {
  client,
  connectRedis,
};
