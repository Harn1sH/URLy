import { Request, Response } from "express";
import {
  getAnalyticsFromAlias,
  getAnalyticsFromTopic,
  getAllAnalytics,
} from "../services/analyticService";
import { User } from "../entities/user.entity";

export const getAliasAnalytics = async (req: Request, res: Response) => {
  try {
    const { alias } = req.params;
    const user = req.user as User;

    const analytics = await getAnalyticsFromAlias(alias, user.googleID);
    const response = {
      totalClicks: analytics.totalClicks,
      uniqueUsers: analytics.uniqueUsers,
      clicksByDate: analytics.clicksByDate,
      deviceType: analytics.deviceType,
      osType: analytics.osType,
    };
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopicAnalytics = async (req: Request, res: Response) => {
  try {
    const { topic } = req.params;
    const user = req?.user as User;

    const analytics = await getAnalyticsFromTopic(topic, user.googleID);
    const response = {
      totalClicks: analytics.totalClicks,
      uniqueUsers: analytics.uniqueUsers,
      clicksByDate: analytics.clicksByDate,
      deviceType: analytics.deviceType,
      osType: analytics.osType,
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalAnalytics = async (req: Request, res: Response) => {
  try {
    const user: User = req.user as User;
    const { allAnalytics:analytics, totalUrls } = await getAllAnalytics(user.googleID);

    const response = {
      totalUrls,
      totalClicks: analytics.totalClicks,
      uniqueUsers: analytics.uniqueUsers,
      clicksByDate: analytics.clicksByDate,
      deviceType: analytics.deviceType,
      osType: analytics.osType,
    };

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
