import express from 'express';
import mongoose from 'mongoose';
import { Conversation } from '../models/conversationModel';
import { authMiddleware } from '../middleware/authMiddleware';

// Lazy load io to prevent circular dependency in tests
let io: any = null;

function getIO() {
  if (!io) {
    try {
      io = require('../../server').io;
    } catch (e) {
      // For testing, io might be undefined
      io = { to: () => ({ emit: () => {} }) };
    }
  }
  return io;
}
export const conversationRouter = express.Router();
// Middleware para autenticar todas las rutas
conversationRouter.use(authMiddleware);
/**
 * GET /api/conversations
 * Obtener todas las conversaciones del usuario actual
 */
conversationRouter.get('/conversations', async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const conversations = await Conversation.find({
      $or: [{ user1: userId }, { user2: userId }]
    })
      .populate('user1', 'username email profileImageUrl')
      .populate('user2', 'username email profileImageUrl')
      .sort({ lastMessageAt: -1 });
    // Transformar la respuesta para que sea más fácil de usar en frontend
    const formattedConversations = conversations.map(conv => {
      const otherUserId = conv.user1._id.toString() === userId.toString() ? conv.user2._id : conv.user1._id;
      const otherUser = conv.user1._id.toString() === userId.toString() ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[conv.messages.length - 1];
      return {
        _id: conv._id,
        otherUserId,
        otherUser,
        lastMessage: lastMessage || null,
        messageCount: conv.messages.length,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
        lastMessageAt: conv.lastMessageAt
      };
    });
    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    res.status(500).json({ message: 'Error obteniendo conversaciones', error });
  }
});
/**
 * GET /api/conversations/:otherUserId
 * Obtener una conversación específica con otro usuario
 */
conversationRouter.get('/conversations/:otherUserId', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    // Buscar conversación entre los dos usuarios (independientemente del orden)
    const conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    })
      .populate('user1', 'username email profileImageUrl')
      .populate('user2', 'username email profileImageUrl');
    if (!conversation) {
      // Si no existe, retornar una conversación vacía
      return res.status(200).json({
        _id: null,
        user1: userId,
        user2: otherUserId,
        messages: [],
        createdAt: null,
        lastMessageAt: null
      });
    }
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error obteniendo conversación:', error);
    res.status(500).json({ message: 'Error obteniendo conversación', error });
  }
});
/**
 * DELETE /api/conversations/:otherUserId
 * Eliminar completamente una conversación con otro usuario
 */
conversationRouter.delete('/conversations/:otherUserId', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    // Eliminar la conversación entre los dos usuarios
    const result = await Conversation.findOneAndDelete({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    });
    if (!result) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }
    // Emitir evento Socket.IO al otro usuario para notificarle que la conversación fue eliminada
    const ioInstance = getIO();
    if (ioInstance) {
      ioInstance.to(`user:${otherUserId}`).emit('conversation:deleted', {
        deletedBy: userId,
        otherUserId: otherUserId,
        conversationId: result._id,
        message: 'La conversación ha sido eliminada por el otro usuario'
      });
    }
    res.status(200).json({ 
      message: 'Conversación eliminada exitosamente',
      deletedConversationId: result._id
    });
  } catch (error) {
    console.error('Error eliminando conversación:', error);
    res.status(500).json({ message: 'Error eliminando conversación', error });
  }
});
/**
 * GET /api/conversations/verify/:otherUserId
 * Verificar si una conversación existe (útil para depuración)
 */
conversationRouter.get('/conversations/verify/:otherUserId', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    });
    res.status(200).json({
      exists: !!conversation,
      conversationId: conversation?._id || null,
      messageCount: conversation?.messages.length || 0,
      hasTradeProposal: !!conversation?.lastTradeProposal
    });
  } catch (error) {
    console.error('Error verificando conversación:', error);
    res.status(500).json({ message: 'Error verificando conversación', error });
  }
});
/**
 * POST /api/conversations/:otherUserId/trade-proposal
 * Guardar una propuesta de intercambio en la conversación
 */
conversationRouter.post('/conversations/:otherUserId/trade-proposal', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    const { proposal } = req.body;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    if (!proposal) {
      return res.status(400).json({ message: 'proposal es requerido' });
    }
    // Buscar o crear la conversación
    let conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    });
    if (conversation?.isLocked) {
      return res.status(423).json({ message: 'La conversación está bloqueada y no acepta nuevas propuestas' });
    }
    if (!conversation) {
      // Crear nueva conversación (siempre con los IDs ordenados para consistencia)
      const [user1, user2] = [userId, otherUserId].sort((a: any, b: any) => 
        a.toString().localeCompare(b.toString())
      );
      conversation = new Conversation({
        user1,
        user2,
        messages: [],
        lastTradeProposal: {
          proposer: userId,
          proposal,
          createdAt: new Date()
        }
      });
    } else {
      // Actualizar la última propuesta manteniendo el proposer original o el actual
      // Si ya existe una propuesta, mantener el proposer original
      const proposerToUse = conversation.lastTradeProposal?.proposer || userId;
      conversation.lastTradeProposal = {
        proposer: proposerToUse,
        proposal,
        createdAt: conversation.lastTradeProposal?.createdAt || new Date()
      };
    }
    await conversation.save();
    res.status(201).json({
      message: 'Propuesta de intercambio guardada exitosamente',
      data: conversation.lastTradeProposal
    });
  } catch (error) {
    console.error('Error guardando propuesta de intercambio:', error);
    res.status(500).json({ message: 'Error guardando propuesta de intercambio', error });
  }
});
/**
 * GET /api/conversations/:otherUserId/trade-proposal
 * Obtener la última propuesta de intercambio de una conversación
 */
conversationRouter.get('/conversations/:otherUserId/trade-proposal', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    const conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    });
    if (!conversation || !conversation.lastTradeProposal) {
      return res.status(200).json({
        lastTradeProposal: null
      });
    }
    res.status(200).json({
      lastTradeProposal: conversation.lastTradeProposal
    });
  } catch (error) {
    console.error('Error obteniendo propuesta de intercambio:', error);
    res.status(500).json({ message: 'Error obteniendo propuesta de intercambio', error });
  }
});
/**
 * PATCH /api/conversations/:otherUserId/lock
 * Bloquea el chat y agrega un mensaje del sistema para informar a ambos usuarios.
 */
conversationRouter.patch('/conversations/:otherUserId/lock', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    const { reason } = req.body as { reason?: 'accepted' | 'deleted' };
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    if (!reason || !['accepted', 'deleted'].includes(reason)) {
      return res.status(400).json({ message: 'reason debe ser accepted | deleted' });
    }
    // Buscar o crear conversación
    let conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    });
    if (!conversation) {
      const [user1, user2] = [userId, otherUserId].sort((a: any, b: any) =>
        a.toString().localeCompare(b.toString())
      );
      conversation = new Conversation({
        user1,
        user2,
        messages: [],
        isLocked: false
      });
    }
    // Si ya está bloqueada, no duplicar mensajes
    if (conversation.isLocked && conversation.lockedReason === reason) {
      return res.status(200).json({
        message: 'La conversación ya estaba bloqueada',
        conversation,
      });
    }
    const systemText = reason === 'accepted'
      ? 'Propuesta aceptada, puede eliminar el chat'
      : 'Propuesta eliminada, puede eliminar el chat';
    const systemMessage = {
      fromUserId: userId,
      kind: 'system' as const,
      payload: { text: systemText, reason },
      createdAt: new Date()
    };
    conversation.isLocked = true;
    conversation.lockedReason = reason;
    conversation.lockedAt = new Date();
    conversation.messages.push(systemMessage);
    await conversation.save();
    return res.status(200).json({
      message: 'Conversación bloqueada correctamente',
      conversation,
      systemMessage
    });
  } catch (error) {
    console.error('Error bloqueando conversación:', error);
    res.status(500).json({ message: 'Error bloqueando conversación', error });
  }
});
/**
 * POST /api/conversations/:otherUserId/messages
 * Agregar un mensaje a una conversación (para persistencia)
 */
conversationRouter.post('/conversations/:otherUserId/messages', async (req, res) => {
  try {
    const userId = req.user?._id;
    const { otherUserId } = req.params;
    const { kind, payload } = req.body;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }
    if (!kind || !payload) {
      return res.status(400).json({ message: 'kind y payload son requeridos' });
    }
    // Buscar o crear la conversación
    let conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: otherUserId },
        { user1: otherUserId, user2: userId }
      ]
    });
    if (!conversation) {
      // Crear nueva conversación (siempre con los IDs ordenados para consistencia)
      const [user1, user2] = [userId, otherUserId].sort((a: any, b: any) => 
        a.toString().localeCompare(b.toString())
      );
      conversation = new Conversation({
        user1,
        user2,
        messages: [{
          fromUserId: userId,
          kind,
          payload,
          createdAt: new Date()
        }]
      });
    } else {
      // Agregar mensaje a la conversación existente
      conversation.messages.push({
        fromUserId: userId,
        kind,
        payload,
        createdAt: new Date()
      });
    }
    await conversation.save();
    // Retornar el mensaje agregado
    const addedMessage = conversation.messages[conversation.messages.length - 1];
    res.status(201).json({
      message: 'Mensaje agregado exitosamente',
      data: addedMessage
    });
  } catch (error) {
    console.error('Error agregando mensaje:', error);
    res.status(500).json({ message: 'Error agregando mensaje', error });
  }
});
