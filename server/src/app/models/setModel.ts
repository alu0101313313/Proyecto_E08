import {model, Schema} from 'mongoose';
import type { ISet } from '../interface/ISets.js';

const setSchema = new Schema<ISet>({
  idSet: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  logo: { type: String },
  symbol: { type: String, required: true },
  cardCount: {
    total: { type: Number, required: true },
    official: { type: Number, required: true },
    reverse: { type: Number, required: true },
    holo: { type: Number, required: true },
    firstEdition: { type: Number, required: true },
  },
  serie: { type: Object, required: true },
  releaseDate: { type: String, required: true },
  legal: {
    standard: { type: Boolean, required: true },
    expanded: { type: Boolean, required: true },
  },
  cards: { type: [Object], required: true },
});

export const Sets = model<ISet>('Set', setSchema);