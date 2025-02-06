import jwt from "jsonwebtoken";
import { envVariables } from "./envVariables";

export const getJWT = (payload: any): string => {
  const token = jwt.sign(payload, envVariables.JWT_SECRET!, {expiresIn: '1h'});

  return token;
 }