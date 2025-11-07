// src/models/index.js
import sequelize from "../loaders/sequelize.js";
import { DataTypes } from "sequelize";

// Example model (we’ll replace later with real ones)
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export { sequelize, User };
