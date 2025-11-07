// src/routes/index.js
import express from "express";
import healthRoutes from "./health.route.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

// Base health route
router.use("/health", healthRoutes);

// Example test route
router.get(
  "/ping",
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Pong 🏓",
    });
  })
);

// Future routes: router.use('/user', userRoutes);

export default router;
