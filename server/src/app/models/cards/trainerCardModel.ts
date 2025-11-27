import { Schema, model } from 'mongoose';
import type { ITrainerCard } from '../../interface/cards/ITrainerCard.js';
import { TypeConditionCard } from '../../enums/enumConditionCard.js';

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
  image: { type: String },
  rarity: { type: String },
  setName: { type: Object },
  variants: { type: Object },
  updated: { type: String },
  condition: { type: String, default: TypeConditionCard.MINT },
  isTradable: { type: Boolean },
  trainerType: { type: String },
  effect: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo de Usuario
    required: true,
    index: true // Indexamos para búsquedas rápidas
  },
  pricing: {
    cardmarket: {
      updated: { type: String },
      unit: { type: String },
      avgPrice: { type: Number },
      avgHoloPrice: { type: Number },
    },
    tcgplayer: {
      updated: { type: String },
      unit: { type: String },
      normal: {
        marketPrice: { type: Number },
        avgHoloPrice: { type: Number },
      },
      reverse: {
        marketPrice: { type: Number },
        avgHoloPrice: { type: Number },
      },
    },
  }
})

export const TrainerCard = model<ITrainerCard>('TrainerCard', trainerCardSchema);