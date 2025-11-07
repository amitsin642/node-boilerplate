// src/config/database.js
import config from "./config.js";

const databaseConfig = {
  username: config.database.user,
  password: config.database.password,
  database: config.database.name,
  host: config.database.host,
  port: config.database.port,
  dialect: "mysql", // or "postgres"
  logging: false, // disable SQL logs in console for cleaner output
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    freezeTableName: true, // prevent plural table names
    timestamps: true, // automatically add createdAt/updatedAt
  },
};

export default databaseConfig;
