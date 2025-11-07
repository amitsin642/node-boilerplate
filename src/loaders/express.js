// src/loaders/express.js
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import routes from "../routes/index.js";
import { errorHandler, notFoundHandler } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";
import config from "../config/config.js";

export default async function expressLoader() {
  const app = express();

  // Basic security headers
  app.use(helmet());

  // Enable CORS
  app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

  // Compress responses
  app.use(compression());

  // Parse JSON and form data
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Request logging (Morgan)
  if (config.env !== "production") {
    app.use(
      morgan("dev", {
        stream: { write: (msg) => logger.http(msg.trim()) },
      })
    );
  }

  // Register routes
  app.use("/api/v1", routes);

  // 404 handler
  app.use(notFoundHandler);

  // Central error handler
  app.use(errorHandler);

  // Handle uncaught errors
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught Exception:", err);
  });

  process.on("unhandledRejection", (err) => {
    logger.error("Unhandled Rejection:", err);
  });

  return app;
}
