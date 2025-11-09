import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../loaders/sequelize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Dynamically import all model files
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".model.js"));

for (const file of modelFiles) {
  const { default: modelDef } = await import(path.join(__dirname, file));
  const model = modelDef(sequelize);
  db[model.name] = model;
}

// Setup associations (if defined)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = sequelize.constructor;

export default db;
