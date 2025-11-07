// src/server.js
import createApp from "./app.js";
import config from "./config/config.js";
import logger from "./utils/logger.js";

const startServer = async () => {
  try {
    const app = await createApp();
    app.listen(config.port, () => {
      logger.info(`✅ Server running on port ${config.port} (${config.env})`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
