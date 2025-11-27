import { model, Schema } from 'mongoose';
import type { IPokemonCard } from '../../interface/cards/IPokemonCard.js';
import { TypeConditionCard } from '../../enums/enumConditionCard.js';

const pokemonCardSchema = new Schema<IPokemonCard>({
  id: { type: String, required: true },
  name: { type: String },
  image: { type: String },
  category: { type: String, required: true },
  setName: { type: Object },
  rarity: { type: String },
  variants: { type: Object },
  updated: { type: String },
  condition: { type: String, default: TypeConditionCard.MINT },
  isTradable: { type: Boolean, default: false },
  hp: { type: Number },
  types: { type: [String] },
  stage: { type: String },
  evolvesFrom: { type: String },
  description: { type: String },
  
  // --- CORRECCIÓN AQUÍ: Añadimos corchetes [] para indicar Array ---
  attacks: [{
    cost: { type: [String] },
    name: { type: String },
    effect: { type: String },
    damage: { type: Number }, // Cambiado a Number (la API puede devolver string a veces, pero intentaremos number)
  }],
  // ----------------------------------------------------------------

  weaknesses: [{
    type: { type: String },
    value: String
  }],
  resistances: [{
    type: { type: String },
    value: { type: String },
  }],
  retreatCost: { type: Number },
  
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
  },
  
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  }
});

export const PokemonCard = model<IPokemonCard>('PokemonCard', pokemonCardSchema);