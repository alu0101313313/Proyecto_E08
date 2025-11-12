import type { IEnergyCard } from "./cards/IEnergyCard.js";
import type { IPokemonCard } from "./cards/IPokemonCard.js";
import type { ITrainerCard } from "./cards/ITrainerCard.js";

export interface ICollection {
  id: string;
  name: string;
  logo: string;
  cardsCount: number;
  cards: Array<IPokemonCard | ITrainerCard | IEnergyCard>;
}