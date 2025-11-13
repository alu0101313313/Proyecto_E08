import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeCardRarity } from "../../enums/typeCardRarity.js";
import type { ISetBrief } from "../ISets.js";
import type { TypeConditionCard } from "../../enums/enumConditionCard.js";
// import { Document } from "mongoose";

export interface ICard extends Document {
  id_card: {
    set: string;
    number: string;
  };
  name: string;
  image: string;
  category: TypeCard;
  rarity: TypeCardRarity;
  ilustrator: string;
  set: ISetBrief;
  variants: {
    firstedition: boolean;
    holo: boolean;
    reverse: boolean;
    normal: boolean;
    wPromo: boolean;
  }
  updated: String;
  condition: TypeConditionCard;
}

export interface ICardBrief extends Document {
  idCard: string;
  localIDCard: string;
  name: string;
  image: string;
}