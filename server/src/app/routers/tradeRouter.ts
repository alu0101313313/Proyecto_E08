import express from "express";
import type { ICardBrief } from "../interface/cards/Icard";
import type { ITrade } from "../interface/ITrade";
import { Trade } from "../models/tradeModel";
import mongoose from "mongoose";
import { StatusTrade } from "../enums/enumStatusTrade";

export const tradeRouter = express.Router();

tradeRouter.post("/trades", async (req, res) => {
  try {
    const { user1, user2, user1Items, user2Items } = req.body;

    const user1NewCards: ICardBrief[] = [];
    const user2NewCards: ICardBrief[] = [];
    
    if (!user1 || !user2 || !user1Items || !user2Items) {
      return res.status(400).json({ message: "Missing required fields" });
    } else if ((user1Items as ICardBrief[]).length === 0 || (user2Items as ICardBrief[]).length === 0) {
      return res.status(400).json({ message: "Both users must offer at least one item for trade" });
    }

    for (const item of user1Items as ICardBrief[]) {
      if (user2Items.find((i: ICardBrief) => i.id === item.id)) {
        return res.status(400).json({ message: "Users cannot trade the same card" });
      } else if (user2Items.collection.includes(item.id)) {
        return res.status(400).json({ message: "User2 already owns one of the cards offered by User1" });
      }

      // const priceCard = await getCardPrice(item.id);
      // user1AproxValue += priceCard;

      user2NewCards.push(item);

    }

    for (const item of user2Items as ICardBrief[]) {
      if (user1Items.find((i: ICardBrief) => i.id === item.id)) {
        return res.status(400).json({ message: "Users cannot trade the same card" });
      } else if (user1Items.collection.includes(item.id)) {
        return res.status(400).json({ message: "User1 already owns one of the cards offered by User2" });
      }

      // const priceCard = await getCardPrice(item.id);
      // user2AproxValue += priceCard;

      user1NewCards.push(item);
    }


    const newTrade: ITrade = new Trade({
      id: new mongoose.Types.ObjectId().toHexString(),
      user1,
      user2,
      user1NewCards,
      user2NewCards,
      user1AproxValue: 0,
      user2AproxValue: 0,
      status: StatusTrade.PENDING,
    });
    const savedTrade = await newTrade.save();
    res.status(201).json(savedTrade);
  } catch (error) {
    res.status(500).json({ message: "Error creating trade", error });
  }
});