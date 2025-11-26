import {model, Schema} from 'mongoose';
import type { IPokemonCard } from '../../interface/cards/IPokemonCard.js';

const pokemonCardSchema = new Schema<IPokemonCard>({
  id: { type: String, required: true },
  name: { type: String,  },
  image: { type: String,  },
  category: { type: String, required: true },
  setName: { type: Object,  },
  variants: { type: Object,  },
  updated: { type: String,  },
  condition: { type: String },
  isTradable: { type: Boolean },
  hp: { type: Number,  },
  types: { type: [String],  },
  stage: { type: String,  },
  evolvesFrom: { type: String },
  description: { type: String },
  attacks: {
    cost: { type: [String],  },
    name: { type: String,  },
    effect: { type: String,  },
    damage: { type: Number },
  },
  weaknesses: {
    type: [{ type: String,  }],
    value: { type: String,  },
  },
  resistances: {
    type: [{ type: String,  }],
    value: { type: String,  },
  },
  retreatCost: { type: Number,  },
  pricing: {
    cardmarket: {
      updated: { type: String,  },
      unit: { type: String,  },
      avgPrice: { type: Number,  },
      avgHoloPrice: { type: Number,  },
    },
    tcgplayer: {
      updated: { type: String,  },
      unit: { type: String,  },
      normal: {
        marketPrice: { type: Number,  },
        avgHoloPrice: { type: Number,  },
      },
      reverse: {
        marketPrice: { type: Number,  },
        avgHoloPrice: { type: Number,  },
      },
    },
  },
});

export const PokemonCard = model<IPokemonCard>('PokemonCard', pokemonCardSchema);