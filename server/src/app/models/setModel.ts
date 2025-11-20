import { model, Schema } from 'mongoose';
import type { ISet } from '../interface/ISets.js';

/**
 * Mongoose schema and model for the Set entity.
 * 
 * Fields:
 * - cardCount: An object containing counts of different card types.
 * - cards: An array of card objects included in the set.
 * - id: A unique identifier for the set (required).
 * - name: The name of the set.
 * - logo: The logo image URL for the set.
 * - symbol: The symbol representing the set.
 * - serie: An object representing the series to which the set belongs.
 * - releaseDate: The release date of the set.
 * - legal: An object indicating the legality of the set in different formats.
 */
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
