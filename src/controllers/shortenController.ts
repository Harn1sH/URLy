import { Request, Response } from "express";
import { getLongUrl, shortenUrl } from "../services/urlService";
import { nanoid } from "nanoid";

export const urlShortener = async (req: Request, res: Response) => {
  try {
    let { longUrl, customAlias, topic } = req.body;
    const url = await shortenUrl(longUrl, customAlias, topic);

    res.json({ shortUrl: url?.alias, createdAt: url?.createdAt });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const urlRedirecter = async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    const { uniqueUserId } = req.cookies;

    const longUrl = await getLongUrl(alias, req.headers["user-agent"] ?? "", !uniqueUserId);
    res.cookie("uniqueUserId", nanoid(10)).redirect(longUrl!);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
