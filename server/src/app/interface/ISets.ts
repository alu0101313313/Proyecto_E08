import type { Document } from "mongoose";
import type { ICardBrief } from "./cards/Icard.js";
import type { ISeriesBrief } from "./ISeries.js";

export interface ISet extends Document {
  cardCount: {
    firstEdition: number;
    total: number;
    official: number;
    reverse: number;
    holo: number;
  };
  cards: Array<ICardBrief>;
  id: string;
  name: string;
  logo?: string;
  symbol: string;
  serie: ISeriesBrief;
  releaseDate: string;
  legal: {
    standard: boolean;
    expanded: boolean;
  }
}

export interface ISetBrief extends Document {
  id: string;
  name: string;
  logo: string;
  symbol: string;
  cardCount: {
    total: number;
    official: number;
  };
}