import { Schema, model } from 'mongoose';
import type { ITrainerCard } from '../../interface/cards/ITrainerCard.js';

/**
 * Mongoose schema and model for the TrainerCard entity.
 * 
 * Fields:
 * - category: The category of the trainer card (required).
 * - id: A unique identifier for the trainer card (required).
 * - idSet: The identifier of the set to which the card belongs.
 * - idNumber: The number of the card within its set.
 * - name: The name of the trainer card.
 * - setName: An object representing the set to which the card belongs.
 * - variants: An object containing variant information for the card.
 * - updated: A string indicating the last update time for the card.
 * - condition: A string describing the condition of the card.
 * - isTradable: A boolean indicating if the card is tradable.
 * - trainerType: The type of trainer (e.g., Supporter, Item, Stadium).
 * - effect: A string describing the effect of the trainer card.
 */
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