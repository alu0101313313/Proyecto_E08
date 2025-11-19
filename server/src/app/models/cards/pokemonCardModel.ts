import {model, Schema} from 'mongoose';
import type { IPokemonCard } from '../../interface/cards/IPokemonCard.js';

const pokemonCardSchema = new Schema<IPokemonCard>({
  commonCardProperties: {
    id_card: { type: String, required: true },
    localID_card: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    set: { type: Object, required: true },
    variants: { type: Object, required: true },
    updated: { type: String, required: true },
    condition: { type: String, required: true },
    isTradable: { type: Boolean, required: true },
  },
  category: { type: String, required: true },
  hp: { type: Number, required: true },
  types: { type: [String], required: true },
  stage: { type: String, required: true },
  evolvesFrom: { type: String },
  description: { type: String },
  attacks: {
    cost: { type: [String], required: true },
    name: { type: String, required: true },
    effect: { type: String, required: true },
    damage: { type: Number },
  },
  weaknesses: {
    type: [{ type: String, required: true }],
    value: { type: String, required: true },
  },
  resistances: {
    type: [{ type: String, required: true }],
    value: { type: String, required: true },
  },
  retreatCost: { type: Number, required: true },
  pricing: {
    cardmarket: {
      updated: { type: String, required: true },
      unit: { type: String, required: true },
      avgPrice: { type: Number, required: true },
      avgHoloPrice: { type: Number, required: true },
    },
    tcgplayer: {
      updated: { type: String, required: true },
      unit: { type: String, required: true },
      normal: {
        marketPrice: { type: Number, required: true },
        avgHoloPrice: { type: Number, required: true },
      },
      reverse: {
        marketPrice: { type: Number, required: true },
        avgHoloPrice: { type: Number, required: true },
      },
    },
  },
});

export const PokemonCard = model<IPokemonCard>('PokemonCard', pokemonCardSchema);