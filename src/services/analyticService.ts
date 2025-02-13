import { AppDataSource } from "../config/data-source";
import { Analytics, ClicksByDate, DeviceType, OsType } from "../entities/analytics.entity";
import { User } from "../entities/user.entity";

const userRepository = AppDataSource.getRepository(User);
const emptyAnalytics: Analytics = {
  id: 0,
  totalClicks: 0,
  uniqueUsers: 0,
  clicksByDate: [],
  deviceType: [],
  osType: [],
};

export const getAnalyticsFromAlias = async (alias: string, loggedinUserID: string) => {
  const user = await userRepository.findOne({
    relations: ["url", "url.analytics"],
    where: { googleID: loggedinUserID, url: { alias: alias } },
  })!;
  let url = user?.url[0];

  if (!url) throw new Error("Invalid url");

  return url.analytics ?? { ...emptyAnalytics };
};

export const getAnalyticsFromTopic = async (topic: string, loggedinUserID: string) => {
  const user = await userRepository.findOne({
    relations: ["url", "url.analytics"],
    select: { id: true, url: true },
    where: { url: { topic }, googleID: loggedinUserID },
  });

  const url = user?.url;

  if (!url) throw new Error("Invalid topic");

  const analytics = url.map((item) => item.analytics ?? ({ ...emptyAnalytics } as Analytics));

  const analyticsFromTopic = getFinalAnalytics(analytics);

  return analyticsFromTopic;
};

export const getAllAnalytics = async (googleID: string) => {
  const user = await userRepository.find({
    select: ["id"],
    where: { googleID },
    relations: ["url", "url.analytics"],
  });

  const url = user.map((item) => item.url).flat();
  const totalUrls = url.length;
  const analytics = url.map((item) => item.analytics ?? { ...emptyAnalytics });

  const allAnalytics = getFinalAnalytics(analytics);

  return { allAnalytics, totalUrls };
};

const getFinalAnalytics = (analyticsList: Analytics[]) => {
  const totalAnalytics = analyticsList.reduce(
    (acc, curr) => {
      acc.id = curr.id ?? acc.id;
      acc.totalClicks += curr.totalClicks;
      acc.uniqueUsers += curr.uniqueUsers;

      acc.osType = getCombinedOsType(acc.osType, curr.osType);
      acc.deviceType = getCombinedDeviceType(acc.deviceType, curr.deviceType);
      acc.clicksByDate = getCombinedClicksByDate(acc.clicksByDate, curr.clicksByDate);

      return acc;
    },
    { ...emptyAnalytics } as Analytics
  );

  return totalAnalytics;
};

const getCombinedOsType = (arr1: OsType[], arr2: OsType[]) => {
  const map = new Map<string, OsType>();
  [...arr1, ...arr2].forEach((item) => {
    if (map.has(item.osName)) {
      const existingOsType = map.get(item.osName)!;
      existingOsType.uniqueClicks += item.uniqueClicks;
      existingOsType.uniqueUsers += item.uniqueUsers;
    } else {
      map.set(item.osName, { ...item });
    }
  });

  return Array.from(map.values());
};

const getCombinedDeviceType = (arr1: DeviceType[], arr2: DeviceType[]) => {
  const map = new Map<string, DeviceType>();

  [...arr1, ...arr2].forEach((item) => {
    if (map.has(item.deviceName)) {
      const existingDeviceType = map.get(item.deviceName)!;
      existingDeviceType.uniqueClicks += item.uniqueClicks;
      existingDeviceType.uniqueUsers += item.uniqueUsers;
    } else {
      map.set(item.deviceName, { ...item });
    }
  });

  return Array.from(map.values());
};

const getCombinedClicksByDate = (arr1: ClicksByDate[], arr2: ClicksByDate[]) => {
  const map = new Map<string, ClicksByDate>();
  [...arr1, ...arr2].forEach((item) => {
    if (map.has(item.date)) {
      const existingDate = map.get(item.date)!;
      existingDate.clickCount += item.clickCount;
    } else {
      map.set(item.date, { ...item });
    }
  });

  const combinedArray = Array.from(map.values());

  while (combinedArray.length > 7) {
    combinedArray.splice(0, 1);
  }

  return combinedArray;
};
