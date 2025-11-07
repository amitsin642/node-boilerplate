// src/testLogger.js
import logger from "./utils/logger.utils.js";

logger.info("Server started successfully");
logger.warn("Low disk space");
logger.error("Something went wrong!");
logger.debug("Debugging variable: %s", JSON.stringify({ x: 10, y: 20 }));
