import { model, Schema } from "mongoose";
import type { IEnergyCard } from "../../interface/cards/IEnergyCard.js";

const energyCardSchema = new Schema<IEnergyCard>({
  id: { type: String, required: true },
  name: { type: String },
  setName: { type: Object },
  variants: { type: Object },
  updated: { type: String },
  condition: { type: String },
  isTradable: { type: Boolean },
  category: { type: String, required: true },
  energyType: { type: String },
  energyTypePokemon: { type: [String]},
  effect: { type: String },
})

export const EnergyCard = model<IEnergyCard>('EnergyCard', energyCardSchema);