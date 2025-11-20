import {model, Schema} from 'mongoose';
import type { IPokemonCard } from '../../interface/cards/IPokemonCard.js';

/**
 * Mongoose schema and model for the PokemonCard entity.
 * 
 * Fields:
 * - id: A unique identifier for the Pokémon card (required).
 * - name: The name of the Pokémon card.
 * - category: The category of the Pokémon card (required).
 * - setName: An object representing the set to which the card belongs.
 * - variants: An object containing variant information for the card.
 * - updated: A string indicating the last update time for the card.
 * - condition: A string describing the condition of the card.
 * - isTradable: A boolean indicating if the card is tradable.
 * - hp: The hit points of the Pokémon.
 * - types: An array of types associated with the Pokémon.
 * - stage: The evolution stage of the Pokémon.
 * - evolvesFrom: The name of the Pokémon from which this one evolves.
 * - description: A string describing the Pokémon.
 * - attacks: An object containing details about the Pokémon's attacks.
 * - weaknesses: An object detailing the Pokémon's weaknesses.
 * - resistances: An object detailing the Pokémon's resistances.
 * - retreatCost: The retreat cost of the Pokémon.
 * - pricing: An object containing pricing information from different marketplaces.
 */
const pokemonCardSchema = new Schema<IPokemonCard>({
  id: { type: String, required: true },
  name: { type: String,  },
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