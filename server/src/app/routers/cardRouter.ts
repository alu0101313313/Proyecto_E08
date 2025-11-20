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

export const cardRouter = express.Router();

cardRouter.post("/cards", async (req, res) => {

  const id_ = req.body.id;
  const category = req.body.category;
  //console.log('Received ID:', id_, 'Category:', category);

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

      // Crear modelo antes de guardar
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

cardRouter.get("/cards", async (req, res) => {

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

// cardRouter.patch() <- no se si va a hacer falta

cardRouter.delete("/cards", async (req, res) => {
  const id = req.body.id;
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