// src/loaders/sequelize.js
import { Sequelize } from "sequelize";
import databaseConfig from "../config/database.js";
import logger from "../utils/logger.js";

let sequelize;

try {
  sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    {
      host: databaseConfig.host,
      port: databaseConfig.port,
      dialect: databaseConfig.dialect,
      pool: databaseConfig.pool,
      logging: databaseConfig.logging ? console.log : false,
      define: databaseConfig.define,
    }
  );

  // Test connection immediately
  await sequelize.authenticate();
  logger.info("✅ Database connected successfully.");
} catch (error) {
  logger.error("❌ Database connection failed:", error);
  process.exit(1);
}

export default sequelize;
