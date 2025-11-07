// src/routes/index.js
import express from "express";
import healthRoutes from "./health.route.js";
import userRoutes from "./user.route.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";

const router = express.Router();

// Base health route
router.use("/health", healthRoutes);
// router.use("/users", userRoutes);

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
