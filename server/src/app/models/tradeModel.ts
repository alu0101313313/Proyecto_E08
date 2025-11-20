import { model, Schema } from 'mongoose';
import type { ITrade } from '../interface/ITrade';

/**
 * Mongoose schema and model for the Trade entity.
 * 
 * Fields:
 * - user1: Reference to the first user involved in the trade.
 * - user2: Reference to the second user involved in the trade.
 * - user1Items: An array of items offered by the first user.
 * - user2Items: An array of items offered by the second user.
 * - user1AproxValue: Approximate value of items from the first user.
 * - user2AproxValue: Approximate value of items from the second user.
 * - status: Current status of the trade.
 */
const tradeSchema = new Schema<ITrade>({  
  user1: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user1Items: [{ type: Object, required: true }],
  user2Items: [{ type: Object, required: true }],
  status: { type: String, required: true},
  user1AproxValue: { type: Number, default: 0 },
  user2AproxValue: { type: Number, default: 0 },
}, { timestamps: true });

export const Trade = model<ITrade>('Trade', tradeSchema);