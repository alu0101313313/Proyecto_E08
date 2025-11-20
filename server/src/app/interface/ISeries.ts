import { Document } from "mongoose";
import type { ISetBrief } from "./ISets.js";

/**
 * Interfaz principal para el documento de Serie.
 * 
 * @id Identificador único de la serie.
 * @name Nombre de la serie.
 * @logo URL del logo de la serie.
 * @sets Array de objetos que representan los sets incluidos en la serie.
 * 
 */
export interface ISeries extends Document{
  id: string;
  name: string;
  logo: string;
  sets: Array<ISetBrief>
}

export interface ISeriesBrief extends Document{
  id: string;
  name: string;
}