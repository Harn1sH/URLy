import { nanoid } from "nanoid";
import { AppDataSource } from "../config/data-source";
import { Url } from "../entities/url.entity";

const urlRepository = AppDataSource.getRepository(Url);

export const shortenUrl = async (longUrl: string, alias: string, topic: string) => {
  if (!alias || alias.trim() === "") {
    let isInvalid = false;
    do {
      alias = nanoid(6);
      const existingUrl = await urlRepository.findOneBy({ alias });
      if (existingUrl) isInvalid = true;
    } while (isInvalid);

    const url = await urlRepository.create({ alias, longUrl, topic: topic ?? null });
    await urlRepository.save(url);

    return url;
  }
  else {
    const existingUrl = await urlRepository.findOneBy({ alias });

    if (!existingUrl) {
      const url = await urlRepository.create({ longUrl, alias, topic: topic ?? null })
      await urlRepository.save(url)

      return url
    }
    else throw new Error("Custom alias already exists, choose another one")
  }
};

export const getLongUrl = async (alias: string) => { 
  const longUrl = await urlRepository.findOneBy({ alias })

  if(!longUrl) throw new Error('Invalid Url')
  
  return longUrl?.longUrl
}