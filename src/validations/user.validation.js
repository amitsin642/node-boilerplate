import Joi from "joi";

/**
 * Example: create user validation schema.
 * Supports body and query validations.
 */

export const createUserSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.empty": "Name is required",
      "string.min": "Name should have at least 2 characters",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Email must be valid",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
    }),
  }),
};

export const getUserByIdSchema = {
  params: Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "any.required": "User ID is required",
      "number.base": "User ID must be a number",
    }),
  }),
};
