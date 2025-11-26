// archivo para la gestión de rutas relacionadas con colecciones de cartas
import express from 'express';
import User from '../models/userModel';
import { PokemonCard } from '../models/cards/pokemonCardModel';

import { authenticate } from '../middleware/authMiddleware';