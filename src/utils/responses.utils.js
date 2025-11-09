// src/utils/response.util.js
import logger from "./logger.utils.js";

/**
 * Unified success response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object|Array|null} [data={}] - Response payload
 * @param {Number} [statusCode=200] - HTTP status code
 * @param {Object|null} [meta=null] - Optional metadata (e.g., pagination info)
 */
export const successResponse = (res, message, data = {}, statusCode = 200, meta = null) => {
  const responseBody = {
    success: true,
    message,
    data: data ?? {},
  };

  if (meta) responseBody.meta = meta;

  logger.debug(`Response Success: ${statusCode} - ${message}`);
  return res.status(statusCode).json(responseBody);
};

/**
 * Unified error response
 * @param {Object} res - Express response object
 * @param {String|Error} error - Error message or object
 * @param {Number} [statusCode=500] - HTTP status code
 * @param {String} [customMessage=null] - Override message
 */
export const errorResponse = (res, error, statusCode = 500, customMessage = null) => {
  let message = customMessage || "Internal Server Error";
  let errorDetails = null;

  // Extract error message & code if AppError or known error object
  if (error) {
    if (typeof error === "string") {
      message = error;
    } else if (error.message) {
      message = error.message;
    }

    // Optional: expose validation errors or operational details (non-sensitive only)
    if (error.details && Array.isArray(error.details)) {
      errorDetails = error.details.map((d) => d.message || d);
    }
  }

  const responseBody = {
    success: false,
    message,
  };

  if (errorDetails) responseBody.errors = errorDetails;

  // Log errors in production too, but with less verbosity if non-dev
  if (statusCode >= 500) {
    logger.error(`Response Error ${statusCode}: ${message}`, { stack: error?.stack });
  } else {
    logger.warn(`Client Error ${statusCode}: ${message}`);
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Shortcut for paginated responses
 * @param {Object} res
 * @param {String} message
 * @param {Array} data
 * @param {Object} pagination
 * @param {Number} [statusCode=200]
 */
export const paginatedResponse = (res, message, data = [], pagination = {}, statusCode = 200) => {
  const responseBody = {
    success: true,
    message,
    data,
    meta: {
      total: pagination.total || 0,
      page: pagination.page || 1,
      limit: pagination.limit || data.length || 0,
      totalPages: pagination.totalPages || Math.ceil((pagination.total || 0) / (pagination.limit || 1)),
    },
  };

  logger.debug(`Paginated Response: page=${pagination.page}, total=${pagination.total}`);
  return res.status(statusCode).json(responseBody);
};

/**
 * Shortcut for no-content success
 * (useful for DELETE endpoints or background triggers)
 * @param {Object} res
 */
export const noContentResponse = (res) => {
  logger.debug("204 No Content");
  return res.status(204).send();
};
