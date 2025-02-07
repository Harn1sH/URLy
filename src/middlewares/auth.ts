import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { envVariables } from "../utils/envVariables";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(403).json({ error: "Not authorized" });
    }
    else {
      jwt.verify(token, envVariables.JWT_SECRET!, (err: VerifyErrors | null, decoded: any) => {
        if (err) res.status(403).json({ error: "Invalid token, login again" });
        else {
          req.user = decoded;
          next();
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
