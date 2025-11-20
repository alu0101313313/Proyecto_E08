import { Document } from "mongoose";

export interface ICardBrief extends Document {
  idCard: string;
  localIDCard: string;
  name: string;
  image: string;
}