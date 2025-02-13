import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";
import { Request, Response } from "express";
import { getJWT } from "../utils/jwt";

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const loggedInUser: any = req.user;

    let user = await userRepository.findOne({ where: { googleID: loggedInUser.id } });

    if (!user) {
      user = await userRepository.create({
        googleID: loggedInUser.id,
        email: loggedInUser.email,
        name: loggedInUser.name,
      });
      await userRepository.save(user);
    }

    const payload = {
      googleID: user.googleID
    };
    const token = getJWT(payload);

    res
      .cookie("token", token, {
        maxAge: 1000 * 60 * 60,
        sameSite: "none",
        secure: true,
      })
      .redirect("/api/docs");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
