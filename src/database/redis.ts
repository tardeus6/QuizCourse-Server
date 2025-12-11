import { createClient } from "redis";

export const redis = createClient({ url: process.env.REDIS_URL });
redis.connect()
  .then(() => console.log("Redis Connected"))
  .catch(err => console.error("Redis Error:", err));
