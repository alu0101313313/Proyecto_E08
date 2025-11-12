import type { ICard } from "./cards/Icard.js";

export interface ICollection extends Document{
  id: string;
  name: string;
  logo: string;
  cardsCount: number;
  cards: Array<ICard>;
}