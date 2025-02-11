import { nanoid } from "nanoid";
import { AppDataSource } from "../config/data-source";
import { Url } from "../entities/url.entity";
import { Analytics } from "../entities/analytics.entity";
import DeviceDetector, { DetectResult } from "node-device-detector";

const urlRepository = AppDataSource.getRepository(Url);

const generateDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0];
};

const getUpdatedAnalytics = ( 
  device: DetectResult,
  analytics: Analytics | null,
  isUserUnique: boolean
): Analytics => {
  if (!analytics) {
    const updatedAnalytics = new Analytics();

    updatedAnalytics.totalClicks = 1;
    updatedAnalytics.uniqueUsers = 1;
    updatedAnalytics.clickByDate = [{ date: generateDate(), clickCount: 1 }];
    updatedAnalytics.deviceType = [
      { deviceType: device?.client?.name || "unidentified", uniqueClicks: 1, uniqueUsers: 1 },
    ];
    updatedAnalytics.osType = [
      { osName: device?.os?.name || "unidentified", uniqueClicks: 1, uniqueUsers: 1 },
    ];

    return updatedAnalytics;
  } else {
    analytics.totalClicks += 1;
    analytics.uniqueUsers = isUserUnique ? analytics.uniqueUsers + 1 : analytics.uniqueUsers;

    const currentDate = generateDate();
    const dateIndex = analytics.clickByDate.findIndex((item) => item.date === currentDate);

    if (dateIndex !== -1) {
      analytics.clickByDate[dateIndex].clickCount += 1;
    } else {
      if (analytics.clickByDate.length >= 7) {
        analytics.clickByDate.pop();
      }
      analytics.clickByDate.push({ date: currentDate, clickCount: 1 });
    }

    const osIndex = analytics.osType.findIndex(
      (item) => item.osName === device?.os?.name || "unidentified"
    );

    if (osIndex !== -1) {
      analytics.osType[osIndex].uniqueClicks += 1;

      analytics.osType[osIndex].uniqueUsers = isUserUnique
        ? analytics.osType[osIndex].uniqueUsers + 1
        : analytics.osType[osIndex].uniqueUsers;
    } else {
      analytics.osType.push({
        osName: device?.os?.name || "unidentified",
        uniqueClicks: 1,
        uniqueUsers: 1,
      });
    }

    const deviceIndex = analytics.deviceType.findIndex(
      (item) => item.deviceType === device?.client?.name || "unidentified"
    );

    if (deviceIndex !== -1) {
      analytics.deviceType[deviceIndex].uniqueClicks += 1;

      analytics.deviceType[deviceIndex].uniqueUsers = isUserUnique
        ? analytics.deviceType[deviceIndex].uniqueUsers + 1
        : analytics.deviceType[deviceIndex].uniqueUsers;
    } else {
      analytics.deviceType.push({
        deviceType: device?.client?.name || "unidentified",
        uniqueClicks: 1,
        uniqueUsers: 1,
      });
    }

    return analytics;
  }
};

export const shortenUrl = async (longUrl: string, alias: string, topic: string) => {
  if (!alias || alias.trim() === "") {
    let isInvalid = false;
    do {
      alias = nanoid(6);
      const existingUrl = await urlRepository.findOneBy({ alias });
      if (existingUrl) isInvalid = true;
    } while (isInvalid);

    const analytics = new Analytics();
    const url = await urlRepository.create({ alias, longUrl, topic: topic ?? null });
    await urlRepository.save(url);

    return url;
  } else {
    const existingUrl = await urlRepository.findOneBy({ alias });

    if (!existingUrl) {
      const url = await urlRepository.create({ longUrl, alias, topic: topic ?? null });
      await urlRepository.save(url);

      return url;
    } else throw new Error("Custom alias already exists, choose another one");
  }
};

export const getLongUrl = async (
  alias: string,
  userDeviceString: string,
  isUserUnique: boolean
) => {
  const deviceDetector = new DeviceDetector();
  const device = deviceDetector.detect(userDeviceString);

  const longUrl = await urlRepository.findOne({ relations: ["analytics"], where: { alias } });

  if (!longUrl) throw new Error("Invalid Url");

  let analytics = getUpdatedAnalytics(device, longUrl.analytics, isUserUnique);
  longUrl.analytics = analytics;
  await urlRepository.save(longUrl);

  return longUrl?.longUrl;
};
