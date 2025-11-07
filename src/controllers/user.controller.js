// // src/controllers/user.controller.js
// import { responses } from "../utils/responses.utils.js";
// import AppError from "../utils/AppError.js";
// import { asyncHandler } from "../middlewares/asyncHandler.js";
// import * as userService from "../services/user.service.js";
// import logger from "../utils/logger.utils.js";

// /**
//  * @desc    Create new user
//  * @route   POST /api/v1/users
//  */
// export const createUser = asyncHandler(async (req, res) => {
//      logger.info(`📩 [UserController] Create user request received`);

//         const userData = req.body;

//   // Delegate to service layer
//   const user = await userService.createUser(userData);

//   logger.info(`✅ [UserController] User created successfully: ID ${user.id}`);
//   return responses.success(res, "User created successfully", user, 201);
// });

// /**
//  * @desc    Get all users
//  * @route   GET /api/v1/users
//  */
// export const getAllUsers = asyncHandler(async (req, res) => {
//   logger.info(`📩 [UserController] Get all users request`);

//   const users = await userService.getAllUsers();

//   return responses.success(res, "Users fetched successfully", users);
// });

// /**
//  * @desc    Get single user by ID
//  * @route   GET /api/v1/users/:id
//  */
// export const getUserById = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   logger.info(`📩 [UserController] Fetch user by ID: ${id}`);

//   const user = await userService.getUserById(id);
//   if (!user) throw new AppError("User not found", 404);

//   return responses.success(res, "User fetched successfully", user);
// });

// /**
//  * @desc    Update user
//  * @route   PUT /api/v1/users/:id
//  */
// export const updateUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const payload = req.body;
//   logger.info(`📩 [UserController] Update user ID: ${id}`);

//   const updatedUser = await userService.updateUser(id, payload);
//   if (!updatedUser) throw new AppError("User not found or not updated", 404);

//   return responses.success(res, "User updated successfully", updatedUser);
// });

// /**
//  * @desc    Soft delete user
//  * @route   DELETE /api/v1/users/:id
//  */
// export const deleteUser = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   logger.info(`📩 [UserController] Delete user ID: ${id}`);

//   const result = await userService.deleteUser(id);
//   if (!result) throw new AppError("User not found", 404);

//   return responses.success(res, "User deleted successfully");
// });
