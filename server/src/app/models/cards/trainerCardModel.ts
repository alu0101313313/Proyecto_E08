import { Schema, model } from 'mongoose';
import type { ITrainerCard } from '../../interface/cards/ITrainerCard.js';

const trainerCardSchema = new Schema<ITrainerCard>({
  category: { type: String, required: true },
  id: { type: String, required: true },
  idSet: { type: String },
  idNumber: { type: String },
  name: { type: String },
  setName: { type: Object },
  variants: { type: Object },
  updated: { type: String },
  condition: { type: String },
  isTradable: { type: Boolean },
  trainerType: { type: String, },
  effect: { type: String },
})

export const TrainerCard = model<ITrainerCard>('TrainerCard', trainerCardSchema);