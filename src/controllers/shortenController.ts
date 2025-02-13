import { Request, Response } from "express";
import { addUniqueUser, getLongUrl, shortenUrl } from "../services/urlService";
import { nanoid } from "nanoid";
import { User } from "../entities/user.entity";

export const urlShortener = async (req: Request, res: Response) => {
  try {
    let { longUrl, customAlias, topic } = req.body;
    const user: User = req.user as User;
    const url = await shortenUrl(longUrl, customAlias, topic, user);

    res.json({ shortUrl: url?.alias, createdAt: url?.createdAt });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const urlRedirecter = async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    let { uniqueUserId } = req.cookies;

    const longUrl = await getLongUrl(alias, req.headers["user-agent"] ?? "", uniqueUserId ?? "");

    if (uniqueUserId) res.redirect(longUrl!);
    else {
      uniqueUserId = nanoid(10);
      res.cookie("uniqueUserId", uniqueUserId).status(302).redirect(longUrl!);
    }

    await addUniqueUser(alias, uniqueUserId);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
