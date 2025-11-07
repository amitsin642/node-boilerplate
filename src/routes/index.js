// src/routes/index.js
import express from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

// ✅ Health Check Route
router.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
    });
  })
);

// Future routes: router.use('/user', userRoutes);

export default router;
