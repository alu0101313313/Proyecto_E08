import {model, Schema} from 'mongoose';
import type { ISeries } from '../interface/ISeries.js';

const serieSchema = new Schema<ISeries>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  logo: { type: String, required: true },
  sets: { type: [Object], required: true },
});

export const Series = model<ISeries>('Serie', serieSchema);