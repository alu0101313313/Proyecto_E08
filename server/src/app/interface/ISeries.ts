import type { ISetBrief } from "./ISets.js";

export interface ISeries {
  id: string;
  name: string;
  logo: string;
  sets: Array<ISetBrief>
}

export interface ISeriesBrief {
  id: string;
  name: string;
}