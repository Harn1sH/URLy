import { createClient } from "redis";
import "dotenv/config";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT || "19474"),
  },
});

console.log("works");

redisClient.on("connect", () => console.log("Connected to redis client"));

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient;
