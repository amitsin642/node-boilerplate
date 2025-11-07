// src/config/config.js
import dotenv from "dotenv";
import path from "path";
import Joi from "joi";

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Define validation schema for environment variables
const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test").default("development"),
  PORT: Joi.number().default(3000),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow("").optional(),

  REDIS_HOST: Joi.string().default("127.0.0.1"),
  REDIS_PORT: Joi.number().default(6379),

  LOG_LEVEL: Joi.string().valid("error", "warn", "info", "http", "debug").default("info"),

  JWT_SECRET: Joi.string().required()
}).unknown(); // Allow other vars

// Validate and extract
const { value: envVars, error } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  console.error("❌ Config validation error:", error.message);
  process.exit(1);
}

// Export a structured config object
const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  jwtSecret: envVars.JWT_SECRET,

  database: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    name: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
  },

  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  },

  log: {
    level: envVars.LOG_LEVEL,
  },
};

export default config;
