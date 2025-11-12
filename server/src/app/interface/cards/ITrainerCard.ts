import type { TypeTrainer } from "../../enums/enumTypeTrainer.js";
import type { TypeCard } from "../../enums/typeCard.js";
import type { ICard } from "./Icard.js";

export interface ITrainerCard {
  commonCardProperties: ICard;
  category: TypeCard;
  trainerType: TypeTrainer;
  effect: string;
}