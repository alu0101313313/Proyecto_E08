import express from 'express';
import { Series } from '../models/serieModel.js';
import type { ISeries } from '../interface/ISeries.js';
import { tcgdex } from '../interface/IAPI.js';
import { dataclassToDict } from '../utils/utils.js';

export const serieRouter = express.Router();

// CRUD operations for Serie can be added here

serieRouter.post("/series", async (req, res) => {
  
  const { id } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const existingSerie = await Series.findOne({ id });
    if (existingSerie) {
      return res.status(200).json({ message: "Serie with this ID already exists", existingSerie });
    }

    const apiResponse = await tcgdex.serie.get(id);
    const serieDict = dataclassToDict(apiResponse);
    const serieJSON = JSON.stringify(serieDict, null, 2);
    const serieData = JSON.parse(serieJSON) as ISeries;

    await serieData.save();
    res.status(201).json({ message: "Serie created successfully", serieData });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Serie with this ID already exists" });
    }
    res.status(500).json({ message: "Error creating serie", error });
  }
});

serieRouter.get("/series/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const serie = await Series.findOne({ id });
    if (!serie) {
      return res.status(404).json({ message: "Serie not found" });
    }
    res.status(200).json(serie);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving serie", error });
  }
});

// serieRouter.patch() <- no se si va a hacer falta

serieRouter.delete("/series/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSerie = await Series.findOneAndDelete({ id });
    if (!deletedSerie) {
      return res.status(404).json({ message: "Serie not found" });
    }
    res.status(200).json({ message: "Serie deleted successfully", deletedSerie });
  } catch (error) {
    res.status(500).json({ message: "Error deleting serie", error });
  }
}); 