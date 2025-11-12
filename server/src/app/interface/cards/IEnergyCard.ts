import type { TypeCard } from "../../enums/typeCard.js";
import type { TypeEnergy } from "../../enums/typeEnergy.js";
import type { ICard } from "./Icard.js";

export interface IEnergyCard {
  commonCardProperties: ICard;
  category: TypeCard;
  energyType: TypeEnergy;
  energyTypePokemon: TypeEnergy[];
  effect: string;
}