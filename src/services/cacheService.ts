import redisClient from "../config/redis";

(async () => {
  try {
    await redisClient.connect();
  } catch (error: any) {
    throw new Error(error.message);
  }
})();

export const getCache = async (key: string) => {
  const longUrl = await redisClient.get(key);

  return longUrl ? JSON.parse(longUrl) : null;
};

export const setCache = async (alias: string, longUrl: string) => {
  await redisClient.set(alias, JSON.stringify(longUrl), { EX: 86400 });
};
