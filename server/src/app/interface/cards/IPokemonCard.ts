import type { StagePokemon } from "../../enums/enumStagePokemon.js";
import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeCurrency } from "../../enums/typeCurrency.js";
import type { TypePokemon } from "../../enums/typePokemon.js";
import type { ICard } from "./Icard.js";
import { Document } from "mongoose";

export interface IPokemonCard extends Document{
  commonCardProperties: ICard;
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