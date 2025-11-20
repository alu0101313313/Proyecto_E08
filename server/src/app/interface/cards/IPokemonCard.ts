import type { StagePokemon } from "../../enums/enumStagePokemon.js";
import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeCardRarity } from "../../enums/typeCardRarity.js";
import type { TypeCurrency } from "../../enums/typeCurrency.js";
import type { TypePokemon } from "../../enums/typePokemon.js";
import type { ISetBrief } from "../ISets.js";
import { Document } from "mongoose";
import type { TypeConditionCard } from "../../enums/enumConditionCard.js";

export interface IPokemonCard extends Document{
  id: string;
  idSet: string;
  idNumber: string;
  name: string;
  image: string;
  rarity: TypeCardRarity;
  ilustrator: string;
  setName: ISetBrief;
  variants: {
    firstedition: boolean;
    holo: boolean;
    reverse: boolean;
    normal: boolean;
    wPromo: boolean;
  }
  updated: String;
  condition: TypeConditionCard;
  isTradable: boolean;
  category: TypeCard;
  hp: number;
  types: TypePokemon[];
  stage: StagePokemon;
  evolvesFrom?: string;
  description?: string;
  attacks: {
    cost: TypePokemon[];
    name: string;
    effect: string;
    damage?: number;
  }
  weaknesses: {
    type: TypePokemon;
    value: string;
  }[];
  resistances: {
    type: TypePokemon;
    value: string;
  }[];
  retreatCost: number;
  pricing: {
    cardmarket: {
      updated: string;
      unit: TypeCurrency;
      avgPrice: number;
      avgHoloPrice: number;
    }
    tcgplayer: {
      updated: string;
      unit: TypeCurrency;
      normal: {
        marketPrice: number;
        avgHoloPrice: number;
      }
      reverse: {
        marketPrice: number;
        avgHoloPrice: number;
      }
    }
  }
}