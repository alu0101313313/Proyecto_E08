import {model, Schema} from 'mongoose';
import type { ISeries } from '../interface/ISeries.js';
/**
 * Mongoose schema and model for the Serie entity.
 * 
 * Fields:
 * - id: A unique identifier for the series (required).
 * - name: The name of the series (required).
 * - logo: The logo image URL for the series (required).
 * - sets: An array of set objects included in the series (required).
 */
const serieSchema = new Schema<ISeries>({
  id: { type: String, required: true , unique: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  sets: { type: [Object], required: true },
});
export const Series = model<ISeries>('Serie', serieSchema);