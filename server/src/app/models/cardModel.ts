import { Schema, model } from 'mongoose';
import type { ICard } from '../types/cardTypes';

/**
 * Schema para el modelo de Carta.
 * Cada documento representa una carta física propiedad de un usuario.
 * @owner Referencia al usuario propietario de la carta.
 * @cardId ID único de la carta (por ejemplo, un identificador de una API externa).
 * @condition Condición física de la carta.
 * @isForTrade Indica si la carta está disponible para intercambio.
 * @addedAt Fecha en que la carta fue añadida a la colección del usuario.
 */
const cardSchema = new Schema<ICard>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El propietario de la carta es obligatorio'],
    index: true // buscar eficientemente las cartas de un usuario
  },
  cardId: { 
    type: String, 
    required: [true, 'El ID de la carta es obligatorio'],
    index: true // para buscar por ID de carta
  },
  condition: {
    type: String,
    enum: ['Mint', 'Near Mint', 'Excellent', 'Good', 'Lightly Played', 'Played', 'Poor'],
    required: [true, 'La condición de la carta es obligatoria']
  },
  isForTrade: {
    type: Boolean,
    default: false
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // createdAt y updatedAt
  timestamps: true
});

/**
 * Creamos y exportamos el modelo 'Card' basado en el cardSchema.
 */
const Card = model<ICard>('Card', cardSchema);

export default Card;