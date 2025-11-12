import { Schema, model } from 'mongoose';
import type { ITrainerCard } from '../../interface/cards/ITrainerCard.js';

const trainerCardSchema = new Schema<ITrainerCard>({
  commonCardProperties: {
    id_card: { type: String, required: true },
    localID_card: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    set: { type: Object, required: true },
    variants: { type: Object, required: true },
    updated: { type: String, required: true },
  },
  category: { type: String, required: true },
  trainerType: { type: String, required: true },
  effect: { type: String, required: true },
})

export const TrainerCard = model<ITrainerCard>('TrainerCard', trainerCardSchema);