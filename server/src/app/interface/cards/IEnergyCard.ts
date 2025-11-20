import type { TypeConditionCard } from "../../enums/enumConditionCard.js";
import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeCardRarity } from "../../enums/typeCardRarity.js";
import type { TypeEnergy } from "../../enums/typeEnergy.js";
import type { ISetBrief } from "../ISets.js";
import { Document } from "mongoose";

export interface IEnergyCard extends Document{
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
  energyType: TypeEnergy;
  energyTypePokemon: TypeEnergy[];
  effect: string;
}