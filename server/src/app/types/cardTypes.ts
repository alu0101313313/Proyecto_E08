import { Document, Types } from 'mongoose';

/**
 * Representa una instancia de carta individual en la colección de un usuario.
 * Almacena data específica del usuario (condición, si está en intercambio),
 * un ID externo (de la API de Pokémon TCG) y una referencia al propietario.
 * @owner Referencia al usuario propietario de la carta.
 * @cardId ID de la carta según la API externa.
 * @condition Condición física de la carta.
 * @isForTrade Indica si la carta está disponible para intercambio.
 * @addedAt Fecha en que la carta fue añadida a la colección del usuario.
 */
export interface ICard extends Document {
  owner: Types.ObjectId; // referencia al usuario propietario
  cardId: string; // ID de la API Cardmarket
  condition: 'Mint' | 'Near Mint' | 'Excellent' | 'Good' | 'Lightly Played' | 'Played' | 'Poor';
  isForTrade: boolean;
  addedAt: Date;
}

