// src/testRedis.js
import initializeRedis from "./loaders/redis.js";

const test = async () => {
  const client = await initializeRedis();
  await client.set("health", "ok");
  const value = await client.get("health");
  console.log("Redis test value:", value);
  await client.quit();
};

test();
