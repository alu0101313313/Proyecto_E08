import { model, Schema } from 'mongoose';
import type { ICollection } from '../interface/ICollection.js';

const collectionSchema = new Schema<ICollection>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  cardsCount: { type: Number, required: true },
  cards: { type: [Object], required: true },
});

export const Collection = model<ICollection>('Collection', collectionSchema);
