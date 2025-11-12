import { model, Schema } from "mongoose";
import type { IEnergyCard } from "../../interface/cards/IEnergyCard.js";

const energyCardSchema = new Schema<IEnergyCard>({
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
  energyType: { type: String, required: true },
  energyTypePokemon: { type: [String], required: true },
  effect: { type: String, required: true },
})

export const EnergyCard = model<IEnergyCard>('EnergyCard', energyCardSchema);