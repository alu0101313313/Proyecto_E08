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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // El campo del modelo es `cardCollection` (array de ObjectId)
    const cardIds = user.cardCollection || [];

    // Si no tiene cartas devolvemos array vacío inmediatamente
    if (!cardIds || cardIds.length === 0) {
      return res.status(200).json([]);
    }

    // Normalizamos los ids a strings para poder comparar tanto _id como el campo `id`
    const idStrings = cardIds.map((c: any) => c.toString());

    // Separar los ids que son ObjectId válidos (para buscar por _id) y usarlos también para buscar por el campo `id`
    const validObjectIds = idStrings.filter((s: string) => mongoose.Types.ObjectId.isValid(s)).map((s: string) => new mongoose.Types.ObjectId(s));

    // Buscamos en las tres colecciones y combinamos resultados
    const [pokemonCards, trainerCards, energyCards] = await Promise.all([
      PokemonCard.find({ $or: [{ _id: { $in: validObjectIds } }, { id: { $in: idStrings } }] }),
      TrainerCard.find({ $or: [{ _id: { $in: validObjectIds } }, { id: { $in: idStrings } }] }),
      EnergyCard.find({ $or: [{ _id: { $in: validObjectIds } }, { id: { $in: idStrings } }] })
    ]);

    const cards = [...pokemonCards, ...trainerCards, ...energyCards];
    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener la colección', error });
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
