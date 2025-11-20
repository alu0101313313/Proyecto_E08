import type { TypeConditionCard } from "../../enums/enumConditionCard.js";
import type { TypeTrainer } from "../../enums/enumTypeTrainer.js";
import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeCardRarity } from "../../enums/typeCardRarity.js";
import type { ISetBrief } from "../ISets.js";
import { Document } from "mongoose";

export interface ITrainerCard extends Document{
  //commonCardProperties: ICard;
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
  trainerType: TypeTrainer;
  effect: string;
}