import { ILanguage } from '../enums/enumLanguageAPI.js';
import TCGdex from '@tcgdex/sdk';
import { TypeCardRarity } from '../enums/typeCardRarity.js';
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
/**
 * Mapea las rarezas de TCGdex al formato del enum TypeCardRarity.
 * La API de TCGdex puede devolver valores como "Ultra Rare", 
 * pero el sistema usa "Rare Ultra".
 * 
 * @param tcgdexRarity - La rareza devuelta por la API de TCGdex
 * @returns La rareza mapeada al formato del enum TypeCardRarity
 */
export function mapRarityFromTCGdex(tcgdexRarity: string | undefined): string {
  if (!tcgdexRarity) return TypeCardRarity.COMMON;
  // Normalizar el input: convertir a lowercase y eliminar espacios extra
  const normalized = tcgdexRarity.toLowerCase().trim();
  const rarityMap: { [key: string]: string } = {
    // Básicas (case insensitive)
    'common': TypeCardRarity.COMMON,
    'uncommon': TypeCardRarity.UNCOMMON,
    'rare': TypeCardRarity.RARE,
    // Ultra Rare y variantes
    'ultra rare': TypeCardRarity.RARE_ULTRA,
    'rare ultra': TypeCardRarity.RARE_ULTRA,
    // Hyper Rare y variantes
    'hyper rare': TypeCardRarity.RARE_HIPER,
    'rare hiper': TypeCardRarity.RARE_HIPER,
    'rare hyper': TypeCardRarity.RARE_HIPER,
    'secret rare': TypeCardRarity.RARE_HIPER,
    'rare secret': TypeCardRarity.RARE_HIPER,
    'rare rainbow': TypeCardRarity.RARE_HIPER,
    // Illustration Rare y variantes
    'illustration rare': TypeCardRarity.RARE_ILUSTRATION,
    'rare illustration': TypeCardRarity.RARE_ILUSTRATION,
    // Special Illustration Rare y variantes
    'special illustration rare': TypeCardRarity.RARE_SPECIAL_ILUSTRATION,
    'rare special illustration': TypeCardRarity.RARE_SPECIAL_ILUSTRATION,
    // Double Rare y variantes
    'double rare': TypeCardRarity.RARE_DOUBLE,
    'rare double': TypeCardRarity.RARE_DOUBLE,
    // Holo y variantes
    'reverse holo': TypeCardRarity.REVERSE_HOLO,
    'holo rare': TypeCardRarity.RARE,
    'rare holo': TypeCardRarity.RARE,
    // Variantes V, VMAX, VSTAR (consideradas Ultra Rare)
    'rare holo v': TypeCardRarity.RARE_ULTRA,
    'rare holo vmax': TypeCardRarity.RARE_ULTRA,
    'rare holo vstar': TypeCardRarity.RARE_ULTRA,
    'rare shiny': TypeCardRarity.RARE_ULTRA,
    'holo rare v': TypeCardRarity.RARE_ULTRA,
    'holo rare vmax': TypeCardRarity.RARE_ULTRA,
    'holo rare vstar': TypeCardRarity.RARE_ULTRA,
    // Rarezas especiales de sets nuevos
    'four diamond': TypeCardRarity.RARE_HIPER,
    'three diamond': TypeCardRarity.RARE_ULTRA,
    'two diamond': TypeCardRarity.RARE_DOUBLE,
    'one diamond': TypeCardRarity.RARE,
    'two star': TypeCardRarity.RARE_ULTRA,
    'one star': TypeCardRarity.RARE,
    // Promo
    'promo': TypeCardRarity.PROMO,
    // None/Unknown -> Common
    'none': TypeCardRarity.COMMON,
    'unknown': TypeCardRarity.COMMON,
  };
  // Si existe un mapeo exacto (case insensitive), usarlo
  if (rarityMap[normalized]) {
    return rarityMap[normalized];
  }
  // Si no hay mapeo exacto, devolver el valor original capitalizado
  // (para mantener compatibilidad con rarezas que ya coinciden)
  return tcgdexRarity;
}