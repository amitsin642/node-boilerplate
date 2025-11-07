// src/server.js
import createApp from "./app.js";
import config from "./config/config.js";
import logger from "./utils/logger.utils.js";
import sequelize from "./loaders/sequelize.js";
import initializeRedis from "./loaders/redis.js";

let server;
let redisClient;

const startServer = async () => {
  try {
    const app = await createApp();
    redisClient = await initializeRedis();

    server = app.listen(config.port, () => {
      logger.info(`✅ Server running on port ${config.port} (${config.env})`);
    });

    // Graceful shutdown on termination signals
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

const shutdown = async () => {
  logger.warn("🛑 Shutting down gracefully...");

  try {
    // 1️⃣ Stop accepting new connections
    if (server) {
      await new Promise((resolve) => server.close(resolve));
      logger.info("✅ HTTP server closed.");
    }

    // 2️⃣ Close Sequelize connection
    await sequelize.close();
    logger.info("✅ Database connection closed.");

    // 3️⃣ Quit Redis client
    if (redisClient) {
      await redisClient.quit();
      logger.info("✅ Redis connection closed.");
    }

    logger.info("👋 Shutdown complete. Exiting process.");
    process.exit(0);
  } catch (err) {
    logger.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

startServer();
