import express from 'express';
import { protect } from '../middleware/authMiddleware';
import User from '../models/userModel';
import { tcgdex, dataclassToDict, mapRarityFromTCGdex } from '../utils/utils';
export const wishlistRouter = express.Router();
// GET: Obtener mi wishlist (con detalles de cartas)
wishlistRouter.get('/wishlist', protect, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    // El usuario tiene un array de strings: ['sv1-1', 'xy-2']
    const wishlistIds = user.wishlist || [];
    // Obtenemos los detalles de cada carta desde la API externa (en paralelo)
    // OJO: Si tienes muchas, esto puede ser lento. En un futuro podrías cachear esto.
    const cardPromises = wishlistIds.map(async (id) => {
      try {
        const cardData = await tcgdex.card.get(id);
        const cardDict = dataclassToDict(cardData);
        // Mapear la rareza al formato del enum TypeCardRarity
        if (cardDict.rarity) {
          cardDict.rarity = mapRarityFromTCGdex(cardDict.rarity);
        }
        return cardDict;
      } catch (e) {
        return null; // Si falla una, no rompemos todo
      }
    });
    // Filtramos los nulos y devolvemos
    const cards = (await Promise.all(cardPromises)).filter(c => c !== null);
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo wishlist", error });
  }
});
// POST: Añadir a wishlist
wishlistRouter.post('/wishlist', protect, async (req, res) => {
  const { cardId } = req.body; // ID de la API (ej. 'sv1-1')
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  if (!cardId) return res.status(400).json({ message: "Falta cardId" });
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    // Evitar duplicados
    if (user.wishlist.includes(cardId)) {
      return res.status(200).json({ message: "Ya está en tu lista" });
    }
    user.wishlist.push(cardId);
    await user.save();
    res.status(200).json({ message: "Añadida a wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error añadiendo a wishlist", error });
  }
});
// DELETE: Quitar de wishlist
wishlistRouter.delete('/wishlist/:cardId', protect, async (req, res) => {
  const { cardId } = req.params;
  if (!req.user) return res.status(401).json({ message: "No autorizado" });
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    // Filtramos el array para quitar el ID
    user.wishlist = user.wishlist.filter((id: string) => id !== cardId);
    await user.save();
    res.status(200).json({ message: "Eliminada de wishlist", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando de wishlist", error });
  }
});