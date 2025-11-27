import { model, Schema } from 'mongoose';
import type { ISet } from '../interface/ISets.js';

const setSchema = new Schema<ISet>({
  cardCount: {
    firstEdition: { type: Number },
    total: { type: Number },
    official: { type: Number },
    reverse: { type: Number },
    holo: { type: Number},
  },
  cards: { type: [Object] },
  id: { type: String, required: true },
  name: { type: String },
  logo: { type: String },
  symbol: { type: String },
  serie: { type: Object },
  releaseDate: { type: String },
  legal: {
    standard: { type: Boolean },
    expanded: { type: Boolean },
  },
});

export const Sets = model<ISet>('Set', setSchema);
//si