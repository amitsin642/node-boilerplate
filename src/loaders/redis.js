// src/loaders/redis.js
import { createClient } from "redis";
import redisConfig from "../config/redis.js";
import logger from "../utils/logger.utils.js";

let redisClient;

export const initializeRedis = async () => {
  if (redisClient) return redisClient; // avoid re-initialization

  try {
    redisClient = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        reconnectStrategy: redisConfig.retryStrategy,
      },
      password: redisConfig.password || undefined,
    });

    // Event Listeners for health and debugging
    redisClient.on("connect", () => {
      logger.info("🟢 Redis client connecting...");
    });

    redisClient.on("ready", () => {
      logger.info("✅ Redis client connected and ready.");
    });

    redisClient.on("error", (err) => {
      logger.error("❌ Redis Client Error:", err.message);
    });

    redisClient.on("reconnecting", () => {
      logger.warn("♻️  Redis reconnecting...");
    });

    redisClient.on("end", () => {
      logger.warn("🔴 Redis connection closed.");
    });

    // Connect to Redis
    await redisClient.connect();
    logger.info("🚀 Redis initialized successfully.");
    return redisClient;
  } catch (error) {
    logger.error("❌ Failed to initialize Redis:", error);
    process.exit(1);
  }
};

// Graceful shutdown on app termination
process.on("SIGINT", async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info("Redis client disconnected on SIGINT");
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (redisClient) {
    await redisClient.quit();
    logger.info("Redis client disconnected on SIGTERM");
  }
  process.exit(0);
});

export default initializeRedis;
