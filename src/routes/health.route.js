// src/routes/health.route.js
import express from "express";
import sequelize from "../loaders/sequelize.js";
import { createClient } from "redis";
import config from "../config/config.js";
import logger from "../utils/logger.utils.js";

const router = express.Router();

// Health check endpoint
router.get("/", async (req, res) => {
  try {
    // Check database connectivity
    let dbStatus = "unknown";
    try {
      await sequelize.authenticate();
      dbStatus = "connected";
    } catch (err) {
      dbStatus = "disconnected";
    }

    // Check Redis connectivity
    let redisStatus = "unknown";
    try {
      const redisClient = createClient({
        socket: { host: config.redis.host, port: config.redis.port },
      });
      await redisClient.connect();
      await redisClient.ping();
      redisStatus = "connected";
      await redisClient.quit();
    } catch (err) {
      redisStatus = "disconnected";
    }

    res.status(200).json({
      success: true,
      message: "App is healthy",
      environment: config.env,
      uptime: `${process.uptime().toFixed(0)}s`,
      database: dbStatus,
      redis: redisStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Health check failed:", error);
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

export default router;
