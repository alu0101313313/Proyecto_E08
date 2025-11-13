import type { Document } from "mongoose";
import type { ICardBrief } from "./cards/Icard.js";
import type { ISeriesBrief } from "./ISeries.js";

export interface ISet extends Document {
  idSet: string;
  name: string;
  logo?: string;
  symbol: string;
  cardCount: {
    total: number;
    official: number;
    reverse: number;
    holo: number;
    firstEdition: number;
  };
  serie: ISeriesBrief;
  releaseDate: string;
  legal: {
    standard: boolean;
    expanded: boolean;
  }
  cards: Array<ICardBrief>;
}

export interface ISetBrief extends Document {
  idSet: string;
  name: string;
  logo: string;
  symbol: string;
  cardCount: {
    total: number;
    official: number;
  };
}