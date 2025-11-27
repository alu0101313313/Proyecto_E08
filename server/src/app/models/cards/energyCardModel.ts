import { model, Schema } from "mongoose";
import type { IEnergyCard } from "../../interface/cards/IEnergyCard.js";
import { TypeConditionCard } from "../../enums/enumConditionCard.js";

/**
 * Mongoose schema and model for the EnergyCard entity.
 * 
 * Fields:
 * - id: A unique identifier for the energy card (required).
 * - name: The name of the energy card.
 * - setName: An object representing the set to which the card belongs.
 * - variants: An object containing variant information for the card.
 * - updated: A string indicating the last update time for the card.
 * - condition: A string describing the condition of the card.
 * - isTradable: A boolean indicating if the card is tradable.
 * - category: The category of the energy card (required).
 * - energyType: The type of energy provided by the card.
 * - energyTypePokemon: An array of Pokémon types that can use this energy.
 * - effect: A string describing the effect of the energy card.
 */
const energyCardSchema = new Schema<IEnergyCard>({
  id: { type: String, required: true },
  name: { type: String },
  setName: { type: Object },
  variants: { type: Object },
  updated: { type: String },
  rarity: { type: String },
  condition: { type: String, default: TypeConditionCard.MINT },
  isTradable: { type: Boolean },
  category: { type: String, required: true },
  energyType: { type: String },
  energyTypePokemon: { type: [String]},
  effect: { type: String },
})

export const EnergyCard = model<IEnergyCard>('EnergyCard', energyCardSchema);