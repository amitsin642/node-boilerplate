import AppError from "../utils/appError.js";

/**
 * Validates incoming requests using Joi schema.
 * Supports body, query, params, and headers.
 * Ensures uniform error handling for all routes.
 *
 * Usage: router.post('/', validate(userSchema), controllerFn)
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validationTargets = ["body", "query", "params", "headers"];
      const errors = [];

      // validate each section (if schema provided)
      validationTargets.forEach((key) => {
        if (schema[key]) {
          const { error, value } = schema[key].validate(req[key], {
            abortEarly: false,
            stripUnknown: true, // remove unexpected keys
            allowUnknown: false, // don't allow unknown keys unless needed
          });

          if (error) {
            const detailMessages = error.details.map((d) => d.message);
            errors.push(...detailMessages);
          } else {
            req[key] = value; // overwrite with sanitized value
          }
        }
      });

      if (errors.length > 0) {
        throw new AppError(
          `Validation failed: ${errors.join(", ")}`,
          400
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default validate;
