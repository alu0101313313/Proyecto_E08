import { ILanguage } from '../enums/enumLanguageAPI.js';
import TCGdex from '@tcgdex/sdk';

export const tcgdex = new TCGdex(`${ILanguage.EN}`); 

export const API_URL = `https://api.tcgdex.net/v2/${ILanguage.EN}`

export function dataclassToDict(obj: any): any {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(dataclassToDict);

  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "sdk") continue;
    result[key] = dataclassToDict(value);
  }
  return result;
}