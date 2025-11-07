// src/app.js
import expressLoader from "./loaders/express.js";
import sequelize from "./loaders/sequelize.js";
import initializeRedis from "./loaders/redis.js";
import logger from "./utils/logger.js";

export default async function createApp() {
  logger.info("🚀 Initializing application...");

  // Initialize Redis
  await initializeRedis();

  // Test DB Connection
  await sequelize.authenticate();
  logger.info("✅ Database connection verified.");

  // Initialize Express
  const app = await expressLoader();

  logger.info("✅ Express app initialized.");
  return app;
}
