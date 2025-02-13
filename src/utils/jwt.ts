import jwt from "jsonwebtoken";
import "dotenv/config";

export const getJWT = (payload: any): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  return token;
 }