// src/routes/user.route.js
import express from "express";
import * as userController from "../controllers/user.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createUserSchema, getUserByIdSchema } from "../validations/user.validation.js";

const router = express.Router();

//validate({ body: searchSchema, query: paginationSchema }),
router.post("/", validate(createUserSchema), userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
