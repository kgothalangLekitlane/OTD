const IORedis = require('ioredis');

let redisClient = null;
let useRedis = false;

if (process.env.REDIS_URL) {
  redisClient = new IORedis(process.env.REDIS_URL);
  useRedis = true;
  redisClient.on('error', (err) => console.error('Redis error', err));
}

const memCache = new Map();

const get = async (key) => {
  if (useRedis) {
    const v = await redisClient.get(key);
    if (!v) return null;
    try { return JSON.parse(v); } catch (e) { return null; }
  }

  const entry = memCache.get(key);
  if (!entry) return null;
  if (entry.expires <= Date.now()) {
    memCache.delete(key);
    return null;
  }
  return entry.value;
};

const set = async (key, value, ttlMs = 60_000) => {
  if (useRedis) {
    const s = JSON.stringify(value);
    await redisClient.set(key, s, 'PX', ttlMs);
    return;
  }

  memCache.set(key, { value, expires: Date.now() + ttlMs });
};

const del = async (key) => {
  if (useRedis) return redisClient.del(key);
  memCache.delete(key);
};

module.exports = { get, set, del };
