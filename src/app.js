// src/app.js
import expressLoader from "./loaders/express.js";
import sequelize from "./loaders/sequelize.js";
import initializeRedis from "./loaders/redis.js";
import logger from "./utils/logger.js";

export default async function createApp() {
  logger.info("🚀 Initializing application...");

  // Test DB
  await sequelize.authenticate();
  logger.info("✅ Database connection verified.");

  // Redis init
  await initializeRedis();
  logger.info("✅ Redis initialized.");

  // Express init
  const app = await expressLoader();
  logger.info("✅ Express app initialized.");

  logger.info("🔥 All systems operational.");
  return app;
}
