// archivo para la gestión de rutas relacionadas con colecciones de cartas
import express from 'express';
import mongoose from 'mongoose';
import User from '../models/userModel';
import { PokemonCard } from '../models/cards/pokemonCardModel';
import { TrainerCard } from '../models/cards/trainerCardModel';
import { EnergyCard } from '../models/cards/energyCardModel';
import { protect } from '../middleware/authMiddleware';
export const collectionRouter = express.Router();
// Ruta para obtener las cartas de la colección del usuario autenticado
collectionRouter.get('/collection', protect, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    // Si viene userId en la query, buscamos las de ese usuario. Si no, las mías.
    const targetUserIdString = (req.query.userId as string) || userId.toString();
    const targetUserId = new mongoose.Types.ObjectId(targetUserIdString);
    // Buscamos directamente por el campo 'owner' en las cartas
    const [pokemonCards, trainerCards, energyCards] = await Promise.all([
      PokemonCard.find({ owner: targetUserId }).lean(),
      TrainerCard.find({ owner: targetUserId }).lean(),
      EnergyCard.find({ owner: targetUserId }).lean()
    ]);
    const cards = [...pokemonCards, ...trainerCards, ...energyCards];
    // Convertir _id a string para todas las cartas
    const cardsWithStringId = cards.map(card => ({
      ...card,
      _id: String(card._id)
    }));
    return res.status(200).json(cardsWithStringId);
  } catch (error) {
    console.error('Error en GET /collection:', error);
    return res.status(500).json({ message: 'Error al obtener la colección', error });
  }
});
// Ruta para obtener las cartas de la colección del usuario autenticado pasado por filtros de edicion, rareza, condicion o tipo
collectionRouter.get('/collection/filter', protect, async (req, res) => {
  try {
    const authenticatedUserId = req.user?._id;
    if (!authenticatedUserId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const { rarity, condition, cardType, userId, isTradable } = req.query;
    // Usar el userId de la query si viene (otra colección), si no usar el usuario autenticado
    const targetUserId = userId ? new mongoose.Types.ObjectId(userId as string) : authenticatedUserId;
    // ==== FILTROS DINÁMICOS ====
    // Buscar por owner (el usuario objetivo)
    const baseFilters: any = {
      owner: targetUserId
    };
    // Aplicar filtros de rareza y condición (comunes a todos los tipos)
    if (rarity) baseFilters.rarity = { $in: (rarity as string).split(',') };
    if (condition) baseFilters.condition = { $in: (condition as string).split(',') };
    if (typeof isTradable !== 'undefined') baseFilters.isTradable = isTradable === 'true';
    // Para el filtro de tipo de carta, necesitamos buscar en diferentes colecciones
    let pokemonCards: any[] = [];
    let trainerCards: any[] = [];
    let energyCards: any[] = [];
    if (cardType) {
      const types = (cardType as string).split(',');
      // Si se selecciona "Pokemon", buscar en PokemonCard
      if (types.includes('Pokemon')) {
        pokemonCards = await PokemonCard.find(baseFilters);
      }
      // Si se selecciona "Trainer", buscar en TrainerCard
      if (types.includes('Trainer')) {
        trainerCards = await TrainerCard.find(baseFilters);
      }
      // Si se selecciona "Energy", buscar en EnergyCard
      if (types.includes('Energy')) {
        energyCards = await EnergyCard.find(baseFilters);
      }
    } else {
      // Si no hay filtro de tipo, buscar en todas las colecciones
      [pokemonCards, trainerCards, energyCards] = await Promise.all([
        PokemonCard.find(baseFilters),
        TrainerCard.find(baseFilters),
        EnergyCard.find(baseFilters)
      ]);
    }
    const cards = [...pokemonCards, ...trainerCards, ...energyCards];
    // Convertir _id a string para todas las cartas
    const cardsWithStringId = cards.map(card => ({
      ...card.toObject ? card.toObject() : card,
      _id: String(card._id)
    }));
    return res.status(200).json(cardsWithStringId);
  } catch (error) {
    console.error('Error al filtrar la colección:', error);
    return res.status(500).json({ message: 'Error al filtrar las cartas', error });
  }
});

// Añadir una carta a la colección del usuario autenticado
collectionRouter.post('/collection/add', protect, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const { cardId } = req.body;
    if (!cardId) return res.status(400).json({ message: 'cardId es requerido' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    const normalized = mongoose.Types.ObjectId.isValid(cardId) ? new mongoose.Types.ObjectId(cardId) : cardId;
    const exists = user.cardCollection.some((c: any) => c.toString() === normalized.toString());
    if (exists) return res.status(200).json({ message: 'Carta ya en la colección' });
    user.cardCollection.push(normalized as any);
    await user.save();
    return res.status(200).json({ message: 'Carta añadida', cardId: normalized });
  } catch (error) {
    return res.status(500).json({ message: 'Error al añadir carta', error });
  }
});
// Eliminar una carta de la colección del usuario autenticado
collectionRouter.delete('/collection/:cardId', protect, async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Usuario no autenticado' });
    const { cardId } = req.params;
    if (!cardId) return res.status(400).json({ message: 'cardId es requerido' });
    const normalized = mongoose.Types.ObjectId.isValid(cardId) ? new mongoose.Types.ObjectId(cardId) : cardId;
    const update = await User.findByIdAndUpdate(userId, { $pull: { cardCollection: normalized } }, { new: true });
    if (!update) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.status(200).json({ message: 'Carta eliminada', cardId: normalized });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar carta', error });
  }
});
