// src/services/user.service.js
import { Op } from "sequelize";
import { sequelize, User } from "../models/index.js";
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.utils.js";

/**
 * Helper to return plain object from sequelize instance or null
 */
const toPlain = (instance) => {
  if (!instance) return null;
  if (typeof instance.toJSON === "function") return instance.toJSON();
  return instance;
};

/**
 * Create a new user (transactional)
 * @param {Object} payload - user data
 * @returns {Object} created user (plain)
 */
export const createUser = async (payload) => {
  const t = await sequelize.transaction();
  try {
    // Basic defensive payload validation (more should be in controller/validation layer)
    if (!payload || Object.keys(payload).length === 0) {
      throw new AppError("Invalid user payload", 400);
    }

    // Example: prevent creating duplicate email (unique constraint should exist at DB)
    if (payload.email) {
      const exists = await User.findOne({ where: { email: payload.email }, transaction: t });
      if (exists) {
        throw new AppError("Email already in use", 409);
      }
    }

    const created = await User.create(payload, { transaction: t });

    await t.commit();
    const plain = toPlain(created);
    logger.info(`[UserService] Created user ${plain.id || plain.email}`);
    return plain;
  } catch (err) {
    await t.rollback();

    // If Sequelize unique constraint error, normalize message
    if (err.name === "SequelizeUniqueConstraintError") {
      const field = err.errors && err.errors[0] && err.errors[0].path;
      throw new AppError(`${field || "field"} already exists`, 409);
    }

    // Re-throw AppError directly, wrap others
    if (err instanceof AppError) throw err;
    logger.error("[UserService] createUser error:", err);
    throw new AppError("Failed to create user", 500);
  }
};

/**
 * Get all users with pagination, filters and ordering
 * @param {Object} options - { page, limit, filters, sortBy, order }
 * @returns {Object} { data: [], meta: { page, limit, total } }
 */
export const getAllUsers = async (options = {}) => {
  try {
    const page = Number(options.page) > 0 ? Number(options.page) : 1;
    const limit = Number(options.limit) > 0 ? Number(options.limit) : 20;
    const offset = (page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const order = (options.order || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    // build where clause from filters (simple example)
    const where = {};
    if (options.q) {
      // search by username or email (case-insensitive)
      where[Op.or] = [
        { username: { [Op.like]: `%${options.q}%` } },
        { email: { [Op.like]: `%${options.q}%` } },
      ];
    }

    // Soft-delete awareness: if model has isDeleted/is_active fields, exclude deleted records
    // We try common field names defensively
    if (User.rawAttributes && User.rawAttributes.isDeleted) {
      where.isDeleted = false;
    } else if (User.rawAttributes && User.rawAttributes.is_active) {
      where.is_active = 1;
    } // else assume DB-level timestamps/paranoid config handles it

    const { rows, count } = await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sortBy, order]],
      distinct: true,
    });

    const data = rows.map(toPlain);

    return {
      data,
      meta: {
        page,
        limit,
        total: Number(count),
      },
    };
  } catch (err) {
    logger.error("[UserService] getAllUsers error:", err);
    throw new AppError("Failed to fetch users", 500);
  }
};

/**
 * Get a single user by ID
 * @param {Number|String} id
 * @returns {Object|null}
 */
export const getUserById = async (id) => {
  try {
    if (!id) throw new AppError("Invalid user id", 400);

    const user = await User.findByPk(id);

    // If soft delete field exists, ensure not returning deleted user
    if (!user) return null;

    // Example: if has isDeleted flag
    if (User.rawAttributes && User.rawAttributes.isDeleted && user.isDeleted) {
      return null;
    }

    return toPlain(user);
  } catch (err) {
    logger.error(`[UserService] getUserById(${id}) error:`, err);
    throw new AppError("Failed to fetch user", 500);
  }
};

/**
 * Update user by ID (transactional)
 * @param {Number|String} id
 * @param {Object} payload
 * @returns {Object|null} updated user
 */
export const updateUser = async (id, payload) => {
  const t = await sequelize.transaction();
  try {
    if (!id) throw new AppError("Invalid user id", 400);
    if (!payload || Object.keys(payload).length === 0) {
      throw new AppError("Invalid update payload", 400);
    }

    const user = await User.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) {
      await t.rollback();
      return null;
    }

    // If email is being changed, ensure new email isn't used by someone else
    if (payload.email && payload.email !== user.email) {
      const exists = await User.findOne({
        where: { email: payload.email, id: { [Op.ne]: id } },
        transaction: t,
      });
      if (exists) {
        throw new AppError("Email already in use", 409);
      }
    }

    await user.update(payload, { transaction: t });
    await t.commit();

    const updated = await User.findByPk(id); // fetch fresh outside tx
    logger.info(`[UserService] Updated user ${id}`);
    return toPlain(updated);
  } catch (err) {
    await t.rollback();
    if (err instanceof AppError) throw err;
    logger.error(`[UserService] updateUser(${id}) error:`, err);
    throw new AppError("Failed to update user", 500);
  }
};

/**
 * Delete user by ID.
 * Tries soft-delete if conventional flags exist, otherwise hard delete.
 * @param {Number|String} id
 * @returns {Boolean} true if deleted, false if not found
 */
export const deleteUser = async (id) => {
  const t = await sequelize.transaction();
  try {
    if (!id) throw new AppError("Invalid user id", 400);

    const user = await User.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!user) {
      await t.rollback();
      return false;
    }

    // Prefer soft-delete patterns if available
    if (User.rawAttributes && User.rawAttributes.isDeleted !== undefined) {
      await user.update({ isDeleted: true }, { transaction: t });
    } else if (User._timestampAttributes && User._timestampAttributes.deletedAt) {
      // Model may be paranoid; use destroy which sets deletedAt
      await user.destroy({ transaction: t });
    } else if (User.rawAttributes && User.rawAttributes.is_active !== undefined) {
      await user.update({ is_active: 0 }, { transaction: t });
    } else {
      // Fallback to hard delete
      await user.destroy({ force: true, transaction: t });
    }

    await t.commit();
    logger.info(`[UserService] Deleted user ${id}`);
    return true;
  } catch (err) {
    await t.rollback();
    logger.error(`[UserService] deleteUser(${id}) error:`, err);
    throw new AppError("Failed to delete user", 500);
  }
};
