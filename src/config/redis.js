// src/config/redis.js
import config from "./config.js";

const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || null,
  retryStrategy: (retries) => {
    // exponential backoff with max cap
    if (retries > 10) {
      return null; // stop retrying after 10 attempts
    }
    return Math.min(retries * 100, 3000);
  },
  connectTimeout: 10000, // 10 seconds
};

export default redisConfig;
