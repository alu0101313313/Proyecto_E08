// archivo para la gestión de rutas relacionadas con colecciones de cartas
import express from 'express';
import User from '../models/userModel';
import { PokemonCard } from '../models/cards/pokemonCardModel';

import { protect } from '../middleware/authMiddleware';

export const collectionRouter = express.Router();

// Ruta para obtener las cartas de la colección del usuario autenticado
collectionRouter.get('/collection', protect, async (req, res) => {
  try {
    // req.user es añadido por el middleware 'protect'
    const userId = req.user?._id; // obtenemos el ID del usuario autenticado
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }
    const user = await User.findById(userId);
    // buscamos el usuario en la base de datos para acceder a su colección

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // obtenemos las cartas de la colección del usuario
    const cardIds = user.collection || [];
    const cards = await PokemonCard.find({ 'id_': { $in: cardIds } });
    res.status(200).json(cards); // devolvemos las cartas como JSON
    
    // formatear y limpiar los datos antes de enviarlos al cliente

    const formattedCards = cards.map(card => ({
      
    }));

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la colección', error });
  }
});
