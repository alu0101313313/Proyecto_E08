import express from "express";
import { TypeCard } from "../enums/typeCard";
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


export const cardRouter = express.Router();

/**
 * @desc Crear una nueva carta en la base de datos según su categoría (Pokémon, Entrenador o Energía).
 * @route POST /cards
 * @access Public
 */
cardRouter.post("/cards", async (req, res) => {

  const id_ = req.body.id;
  const category = req.body.category;

  if (!id_ || !category) {
    return res.status(400).json({ message: "ID and category are required" });
  }

  try {
    if (category === TypeCard.POKEMON) {

      const existingPokemonCard = await PokemonCard.findOne({ id_ });
      if (existingPokemonCard) {
        return res.status(200).json({ message: "Pokemon Card with this ID already exists", existingPokemonCard });
      }

      const apiResponse = await tcgdex.card.get(id_);
      const cardDict = dataclassToDict(apiResponse);
      const cardJSON = JSON.stringify(cardDict, null, 2);
      const cardData = JSON.parse(cardJSON) as IPokemonCard;

      const newPokemon = new PokemonCard(cardData as any);
      await newPokemon.save();
      res.status(201).json({ message: "Pokemon Card created successfully", newPokemon });

    } else if (category === TypeCard.TRAINER) {

      const existingTrainerCard = await TrainerCard.findOne({ id_ });
      if (existingTrainerCard) {
        return res.status(200).json({ message: "Trainer Card with this ID already exists", existingTrainerCard });
      }
      
      const apiResponse = await tcgdex.card.get(id_);
      const cardDict = dataclassToDict(apiResponse);
      const cardJSON = JSON.stringify(cardDict, null, 2);
      const cardData = JSON.parse(cardJSON) as ITrainerCard;

      const newTrainer = new TrainerCard(cardData as any);
      await newTrainer.save();
      res.status(201).json({ message: "Trainer Card created successfully", newTrainer });

    } else if (category === TypeCard.ENERGY) {

      const existingEnergyCard = await EnergyCard.findOne({ id_ });
      if (existingEnergyCard) {
        return res.status(200).json({ message: "Energy Card with this ID already exists", existingEnergyCard });
      }
      
      const apiResponse = await tcgdex.card.get(id_);
      const cardDict = dataclassToDict(apiResponse);
      const cardJSON = JSON.stringify(cardDict, null, 2);
      const cardData = JSON.parse(cardJSON) as IEnergyCard;
      
      const newEnergy = new EnergyCard(cardData as any);
      await newEnergy.save();
      res.status(201).json({ message: "Energy Card created successfully", newEnergy });

    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
  } catch (error: any) {
    console.error('Error in POST /cards:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Card with this ID already exists" });
    }
    res.status(500).json({ message: "Error creating card", error });
  }
}); 

/**
 * @desc Obtener todas las cartas de la base de datos (Pokémon, Entrenador y Energía).
 * @route GET /cards/all
 * @access Public
 */
cardRouter.get("/cards/all", async (_, res) => {
  try {
    const pokemonCards = await PokemonCard.find({});
    const trainerCards = await TrainerCard.find({});
    const energyCards = await EnergyCard.find({});

    return res.status(200).json({
      pokemonCards,
      trainerCards,
      energyCards
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving all cards", error });
  }
});

/**
 * @desc Obtener una carta de la base de datos según su ID y categoría (Pokémon, Entrenador o Energía).
 * @route GET /cards
 * @access Public
 */
cardRouter.get("/cards/:id", async (req, res) => {

  if (!req.query.id || !req.query.category) {
    return res.status(400).json({ message: "ID and category are required" });
  }
  
  const id = req.query.id.toString();
  const category = req.query.category.toString();

  try {
    if (category === TypeCard.POKEMON) {
      const cards = await PokemonCard.find({ id });
      return res.status(200).json(cards);
    } else if (category === TypeCard.TRAINER) {
      const cards = await TrainerCard.find({ id });
      return res.status(200).json(cards);
    } else if (category === TypeCard.ENERGY) {
      const cards = await EnergyCard.find({ id });
      return res.status(200).json(cards);
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving card", error });
  }
});

cardRouter.get("/cards/:name", async (req, res) => {
  const name = req.params.name;

  try {
    const pokemonCards = await PokemonCard.find({ name: new RegExp(name, 'i') });
    const trainerCards = await TrainerCard.find({ name: new RegExp(name, 'i') });
    const energyCards = await EnergyCard.find({ name: new RegExp(name, 'i') });

    if (pokemonCards.length === 0 && trainerCards.length === 0 && energyCards.length === 0) {
      
      const getCardsAPI: ICardBrief[] = [];
      const responseAPI = await fetch(`${API_URL}/cards?name=${name}`);
      const dataAPI: any = await responseAPI.json();

      if (!dataAPI || dataAPI.length === 0) {
        return res.status(404).json({ message: "No cards found with the given name in API server" });
      }

      for (const cardData of dataAPI) {
        const cardDict = dataclassToDict(cardData);
        const cardJSON = JSON.stringify(cardDict, null, 2);
        const cardParsed = JSON.parse(cardJSON) as ICardBrief;
        getCardsAPI.push(cardParsed);
      }

      return res.status(200).json({
        apiCards: getCardsAPI
      });
    }

    return res.status(200).json({
      pokemonCards,
      trainerCards,
      energyCards
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cards by name", error });
  }
});

cardRouter.get("/cards", async (req, res) => { 
  //console.log("GET con flitros avanzados");
  const { rarity, condition, category } = req.query;

  try {
    let filter: any = {};
    let result: any[] = [];

    if (rarity) filter.rarity = rarity;
    if (condition) filter.condition = condition;
    if (category) filter.category = category;
    
    const pokemonCards = await PokemonCard.find(filter);
    result.push(...pokemonCards);
    const trainerCards = await TrainerCard.find(filter);
    result.push(...trainerCards);
    const energyCards = await EnergyCard.find(filter);
    result.push(...energyCards);

    return res.status(200).json({ cards: result });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cards with filters", error });
  }
 });


/**
 * @desc Eliminar una carta de la base de datos según su ID y categoría (Pokémon, Entrenador o Energía).
 * @route DELETE /cards
 * @access Public
 */
cardRouter.delete("/cards/:id", async (req, res) => {
  const id = req.params.id;
  const category = req.body.category;

  try {
    if (category === TypeCard.POKEMON) {
      const deletedCard = await PokemonCard.findOneAndDelete({ id });
      if (!deletedCard) {
        return res.status(404).json({ message: "Pokemon Card not found" });
      }
      return res.status(200).json({ message: "Pokemon Card deleted successfully", deletedCard });
    }
    else if (category === TypeCard.TRAINER) {
      const deletedCard = await TrainerCard.findOneAndDelete({ id });
      if (!deletedCard) {
        return res.status(404).json({ message: "Trainer Card not found" });
      }
      return res.status(200).json({ message: "Trainer Card deleted successfully", deletedCard });
    }
    else if (category === TypeCard.ENERGY) {
      const deletedCard = await EnergyCard.findOneAndDelete({ id });
      if (!deletedCard) {
        return res.status(404).json({ message: "Energy Card not found" });
      }
      return res.status(200).json({ message: "Energy Card deleted successfully", deletedCard });
    } else {
      return res.status(400).json({ message: "Invalid category" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting card", error });
  }
});