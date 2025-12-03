import express from "express";
import { TypeCard } from "../enums/typeCard";
import mongoose from 'mongoose';
import { tcgdex } from "../utils/utils.js";
import { dataclassToDict } from "../utils/utils.js";
import type { IPokemonCard } from "../interface/cards/IPokemonCard.js";
import { PokemonCard } from "../models/cards/pokemonCardModel.js";
import type { ITrainerCard } from "../interface/cards/ITrainerCard.js";
import { TrainerCard } from "../models/cards/trainerCardModel.js";
import type { IEnergyCard } from "../interface/cards/IEnergyCard.js";
import { EnergyCard } from "../models/cards/energyCardModel.js";
import { API_URL } from "../utils/utils.js";
import type { ICardBrief } from "../interface/cards/Icard.js";
import { protect } from "../middleware/authMiddleware";

export const cardRouter = express.Router();
const cleanDamageValue = (damage: any): number => {
  if (typeof damage === 'number') return damage;
  if (typeof damage !== 'string') return 0;
    
  // esto convierte "80x" -> "80", "—" -> "", "50+" -> "50"
  const cleaned = damage.replace(/[^0-9]/g, '');
    
  return parseInt(cleaned, 10) || 0;
};

/**
 * @desc Crear una nueva carta en la base de datos y asignarla al usuario logueado.
 * @route POST /cards
 * @access Private (Requiere Auth)
 */
cardRouter.post("/cards", protect, async (req, res) => {

  const { id: id_, category, condition, isTradable } = req.body; 

  // 1. Verificación de seguridad
  if (!req.user) {
    return res.status(401).json({ message: "Usuario no autorizado" });
  }

  if (!id_) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    // 2. Comprobamos si ESTE usuario ya tiene esta carta (evitar duplicados propios si quieres)
    // OJO: Si permites tener 2 Pikachus iguales, quita esta comprobación.
    // Si la mantienes, busca por { id_, owner: req.user._id }
    
    // Obtenemos datos de la API externa
    const apiResponse = await tcgdex.card.get(id_);
    const cardDict = dataclassToDict(apiResponse);
    let imageUrl = cardDict.image;
    
    if (!imageUrl && cardDict.set && cardDict.localId) {
        // Construcción manual de fallback si la API falla
        // Nota: Asumimos inglés (en). Si tu app es multi-idioma, esto varía.
        // Pero TCGdex suele usar esta estructura.
        imageUrl = `https://assets.tcgdex.net/en/${cardDict.set.id}/${cardDict.localId}`;
    }

    // --- CORRECCIÓN DE ATAQUES ---
    let cleanedAttacks = [];
    if (Array.isArray(cardDict.attacks)) {
      cleanedAttacks = cardDict.attacks.map((attack: any) => ({
        ...attack,
        // APLICAMOS LA LIMPIEZA AQUÍ
        damage: cleanDamageValue(attack.damage) 
      }));
    }
    
    // 3. Preparamos los datos base añadiendo el OWNER y el estado de intercambio
    const cardDataRaw = {
      ...cardDict,
      image: imageUrl,
      owner: req.user._id, 
      isTradable: isTradable,
      condition: condition,
      attacks: cleanedAttacks // usamos los ataques limpiados por si acaso
    };

    // Normalizamos la categoría: preferimos la que envía el cliente, y si no
    // existe usamos la que nos devuelve la API externa (`cardDict.category`).
    const rawCategory = (category || (cardDict && cardDict.category) || '').toString();
    const lc = rawCategory.toLowerCase();
    // Detección más tolerante: comprobamos varias subcadenas (ES/EN, acentos, variantes)
    let resolvedCategory: string = TypeCard.POKEMON; // default
    if (lc.includes('train') || lc.includes('trainer') || lc.includes('entren')) resolvedCategory = TypeCard.TRAINER;
    else if (lc.includes('ener') || lc.includes('energy') || lc.includes('energ')) resolvedCategory = TypeCard.ENERGY;
    else if (lc.includes('pok') || lc.includes('pokemon') || lc.includes('pokémon')) resolvedCategory = TypeCard.POKEMON;

    // Log para depuración de categorías erróneas
    console.debug('[POST /cards] id=', id_, 'req.category=', category, 'api.category=', cardDict?.category, 'resolved=', resolvedCategory);

    // Ahora usamos `resolvedCategory` para decidir el modelo destino
    if (resolvedCategory === TypeCard.TRAINER) {
      const newTrainer = new TrainerCard(cardDataRaw);
      await newTrainer.save();
      res.status(201).json({ message: "Trainer Card created successfully", newTrainer });
    } else if (resolvedCategory === TypeCard.POKEMON) {
      const newPokemon = new PokemonCard(cardDataRaw);
      await newPokemon.save();
      res.status(201).json({ message: "Pokemon Card created successfully", newPokemon });
    } else if (resolvedCategory === TypeCard.ENERGY) {
      const newEnergy = new EnergyCard(cardDataRaw);
      await newEnergy.save();
      res.status(201).json({ message: "Energy Card created successfully", newEnergy });

    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
  } catch (error: any) {
    console.error('Error in POST /cards:', error);
    // Nota: El error 11000 (duplicado) saltará solo si defines índices únicos en Mongo
    res.status(500).json({ message: "Error creating card", error });
  }
}); 

/**
 * @desc Obtener la colección de cartas de un usuario (propia o ajena).
 * @route GET /collection?userId=xxxxx
 * @access Private
 */
cardRouter.get("/collection", protect, async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  try {
    // Si viene userId en la query, buscamos las de ese usuario. Si no, las mías.
    const targetOwnerId = req.query.userId || req.user._id;

    // Buscamos en paralelo en las 3 colecciones filtrando por dueño
    const [pokemonCards, trainerCards, energyCards] = await Promise.all([
      PokemonCard.find({ owner: targetOwnerId }),
      TrainerCard.find({ owner: targetOwnerId }),
      EnergyCard.find({ owner: targetOwnerId })
    ]);

    const allCards = [...pokemonCards, ...trainerCards, ...energyCards];
    res.status(200).json(allCards);

  } catch (error) {
    res.status(500).json({ message: "Error fetching collection", error });
  }
});

/**
 * @desc Buscar usuarios que tienen una carta específica para intercambiar.
 * @route GET /cards/traders/:cardApiId
 * @access Private
 */
cardRouter.get("/cards/traders/:cardApiId", protect, async (req, res) => {
  const { cardApiId } = req.params;

  try {
    // Filtro: ID de la carta, que sea intercambiable, y que NO sea mía
    const filter = { 
        id: cardApiId, 
        isTradable: true,
        owner: { $ne: req.user?._id } 
    };

    const userFields = 'username profileImageUrl email'; // Datos a mostrar del dueño

    // Buscamos y populamos el campo 'owner'
    const [pokemon, trainers, energy] = await Promise.all([
      PokemonCard.find(filter).populate('owner', userFields),
      TrainerCard.find(filter).populate('owner', userFields),
      EnergyCard.find(filter).populate('owner', userFields)
    ]);

    // Unimos y formateamos para el frontend
    const traders = [...pokemon, ...trainers, ...energy].map((card: any) => ({
        cardId: card._id,        // ID de la instancia de la carta
        condition: card.condition,
        owner: card.owner        // Objeto usuario completo
    }));

    res.status(200).json(traders);

  } catch (error) {
    res.status(500).json({ message: "Error finding traders", error });
  }
});

/**
 * @desc Eliminar una carta (asegurando que pertenece al usuario).
 * @route DELETE /cards/:id
 * @access Private
 */
cardRouter.delete("/cards/:id", protect, async (req, res) => {
  const id = req.params.id; // Este debería ser el _id de la base de datos (ObjectId)
  const category = req.body.category;

  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  try {
      // Determinamos si el parámetro corresponde a un ObjectId de Mongo
      const idParam = String(id);
      const isObjectId = mongoose.Types.ObjectId.isValid(idParam);
      // Si es ObjectId, buscamos por _id; en caso contrario, por el campo `id`.
      const baseFilter: any = isObjectId ? { _id: idParam, owner: req.user._id } : { id: idParam, owner: req.user._id };

      let deletedCard;

    // Si no nos pasan categoría o viene mal, intentamos eliminar en las 3 colecciones
    const rawCat = (category || '').toString().toLowerCase();
    if (!rawCat) {
      // Intentamos eliminar en Pokemon -> Trainer -> Energy hasta que uno borre
      deletedCard = await PokemonCard.findOneAndDelete(baseFilter);
      if (!deletedCard) deletedCard = await TrainerCard.findOneAndDelete(baseFilter);
      if (!deletedCard) deletedCard = await EnergyCard.findOneAndDelete(baseFilter);
    } else {
      // Si nos pasan categoría, normalizamos como en POST (tolerante)
      let resolvedCat = TypeCard.POKEMON;
      if (rawCat.includes('train') || rawCat.includes('trainer') || rawCat.includes('entren')) resolvedCat = TypeCard.TRAINER;
      else if (rawCat.includes('ener') || rawCat.includes('energy') || rawCat.includes('energ')) resolvedCat = TypeCard.ENERGY;
      else if (rawCat.includes('pok') || rawCat.includes('pokemon') || rawCat.includes('pokémon')) resolvedCat = TypeCard.POKEMON;

      if (resolvedCat === TypeCard.POKEMON) deletedCard = await PokemonCard.findOneAndDelete(baseFilter);
      else if (resolvedCat === TypeCard.TRAINER) deletedCard = await TrainerCard.findOneAndDelete(baseFilter);
      else if (resolvedCat === TypeCard.ENERGY) deletedCard = await EnergyCard.findOneAndDelete(baseFilter);
    }

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found or you don't own it" });
    }

    return res.status(200).json({ message: "Card deleted successfully", deletedCard });

  } catch (error) {
    res.status(500).json({ message: "Error deleting card", error });
  }
});

/**
 * @desc Update the isTradable status of a card.
 * @route PATCH /cards/:id/tradable
 * @access Private
 */
cardRouter.patch("/cards/:id/tradable", protect, async (req, res) => {
  const { id } = req.params;
  const { isTradable } = req.body;

  if (!req.user) return res.status(401).json({ message: "Not authorized" });

  if (typeof isTradable !== "boolean") {
    return res.status(400).json({ message: "isTradable must be a boolean" });
  }

  try {
    const idParam = String(id);
    const isObjectId = mongoose.Types.ObjectId.isValid(idParam);
    const filter = isObjectId ? { _id: idParam, owner: req.user._id } : { id: idParam, owner: req.user._id };

    let updatedCard = await PokemonCard.findOneAndUpdate(filter, { isTradable }, { new: true });
    if (!updatedCard) updatedCard = await TrainerCard.findOneAndUpdate(filter, { isTradable }, { new: true });
    if (!updatedCard) updatedCard = await EnergyCard.findOneAndUpdate(filter, { isTradable }, { new: true });

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found or you don't own it" });
    }

    return res.status(200).json({ message: "Card tradable status updated", updatedCard });
  } catch (error) {
    res.status(500).json({ message: "Error updating card", error });
  }
});

// --- Rutas Públicas de Lectura General (si las necesitas) ---

cardRouter.get("/cards/all", async (_, res) => {
    // ... tu código existente ...
});

cardRouter.get("/cards/:id", async (req, res) => {
    // ... tu código existente ...
});

cardRouter.get("/cards/:name", async (req, res) => {
    // ... tu código existente ...
});

cardRouter.get("/cards", async (req, res) => { 
    // ... tu código existente ...
});
