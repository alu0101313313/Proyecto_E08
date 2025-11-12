import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeCardRarity } from "../../enums/typeCardRarity.js";
import type { ISetBrief } from "../ISets.js";
//import type { API_IMAGE_URL, API_URL } from "../IAPI.js";

export interface ICard {
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
}

export interface ICardBrief {
  idCard: string;
  localIDCard: string;
  name: string;
  image: string;
}