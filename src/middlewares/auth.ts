import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { envVariables } from "../utils/envVariables";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

const userRepository = AppDataSource.getRepository(User);

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      res.status(403).json({ error: "Not authorized" });
    }
    else {
      const decodedToken = jwt.verify(token, envVariables.JWT_SECRET!) as JwtPayload;

      if (!decodedToken) res.status(403).json({ error: "Invalid token, login again" });
      else {
        const user = await userRepository.findOne({ where: { googleID: decodedToken?.googleID } });
        if (!user) res.status(400).json({ error: "User not found" });
        else {
          req.user = user;
          next();
        }
      }

    
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
