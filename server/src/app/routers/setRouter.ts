import express from 'express';
import { Sets } from '../models/setModel.js';
import { tcgdex } from '../utils/utils.js';
import { dataclassToDict } from '../utils/utils.js';
import type { ISet } from '../interface/ISets.js';

export const setRouter = express.Router();

setRouter.post("/sets", async (req, res) => {

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID is required" });
  }

  try {
    const existingSet = await Sets.findOne({ id });
    if (existingSet) {
      return res.status(200).json({ message: "Set with this ID already exists", existingSet });
    }

    const apiResponse = await tcgdex.set.get(id);
    const setDict = dataclassToDict(apiResponse);
    const setJSON = JSON.stringify(setDict, null, 2);
    const setData = JSON.parse(setJSON) as ISet;
    const newSet = new Sets(setData);

    await newSet.save();
    res.status(201).json({ message: "Set created successfully", newSet });

  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Set with this ID already exists" });
    }
    res.status(500).json({ message: "Error creating set", error });
  }
});

setRouter.get("/sets/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const set = await Sets.findOne({ _id });
    if (!set) {
      return res.status(404).json({ message: "Set not found" });
    }
    res.status(200).json(set);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving set", error });
  }
});

setRouter.get("/sets", async (req, res) => {
  const filter = req.query.name ? { name: req.query.name.toString() } : {};

  try {
    const sets = await Sets.find(filter);
    res.status(200).json(sets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving sets", error });
  }
});

setRouter.get("/sets/:id", async (req, res) => {

  const { id } = req.params;

  try {
    const set = await Sets.findOne({ id });
    if (!set) {
      return res.status(404).json({ message: "Set not found" });
    }
    res.status(200).json(set);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving set", error });
  }
});

// setRouter.patch() <- no se si va a hacer falta

setRouter.delete("/sets/:_id", async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedSet = await Sets.findOneAndDelete({ _id });
    if (!deletedSet) {
      return res.status(404).json({ message: "Set not found" });
    }
    res.status(200).json({ message: "Set deleted successfully", deletedSet });
  } catch (error) {
    res.status(500).json({ message: "Error deleting set", error });
  }
});