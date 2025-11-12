import { Document } from "mongoose";
import type { ISetBrief } from "./ISets.js";

export interface ISeries extends Document{
  id: string;
  name: string;
  logo: string;
  sets: Array<ISetBrief>
}

export interface ISeriesBrief extends Document{
  id: string;
  name: string;
}