import { model, Schema, Types } from 'mongoose';
import type { IConversation } from '../interface/IConversation';
/**
 * Schema para las conversaciones entre usuarios en los intercambios.
 * Almacena todos los mensajes de forma persistente en la base de datos.
 */
const conversationSchema = new Schema<IConversation>(
  {
    user1: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      index: true
    },
    user2: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      index: true
    },
    messages: [
      {
        fromUserId: { 
          type: Schema.Types.ObjectId, 
          ref: 'User',
          required: true 
        },
        kind: { 
          type: String, 
          enum: ['text', 'proposal', 'system'],
          required: true 
        },
        payload: {
          type: Schema.Types.Mixed,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    isLocked: {
      type: Boolean,
      default: false
    },
    lockedReason: {
      type: String,
      enum: ['accepted', 'deleted'],
      default: undefined
    },
    lockedAt: {
      type: Date,
      default: null
    },
    lastTradeProposal: {
      proposer: { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
      },
      proposal: {
        type: Schema.Types.Mixed
      },
      createdAt: {
        type: Date
      }
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true
  }
);
// Crear índices
conversationSchema.index({ user1: 1, user2: 1 });
conversationSchema.index({ lastMessageAt: -1 });
// Middleware para actualizar lastMessageAt cuando se agrega un mensaje
conversationSchema.pre('save', function(next) {
  const doc = this as any;
  if (doc.messages && doc.messages.length > 0) {
    const lastMsg = doc.messages[doc.messages.length - 1];
    doc.lastMessageAt = lastMsg.createdAt || new Date();
  }
  next();
});
export const Conversation = model<IConversation>('Conversation', conversationSchema);
