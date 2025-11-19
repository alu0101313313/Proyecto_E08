import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Importamos cookie-parser
import connectDB from './app/lib/db/connectDB';
import authRoutes from './app/auth/authRoutes'; // Importamos las rutas de auth
// Importa aquí tus otras rutas (usuarios, cartas, etc.)
import { serieRouter } from './app/routers/serieRouter';
import { setRouter } from './app/routers/setRouter';

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares Esenciales ---
// 1. Para parsear JSON del body
app.use(express.json());
// 2. Para parsear URL-encoded data
app.use(express.urlencoded({ extended: true }));
// 3. Para parsear las cookies
app.use(cookieParser());

// --- Rutas de la API ---
// Todas las rutas de autenticación estarán bajo /api/auth
app.use('/api/auth', authRoutes);

// Aquí irán tus otras rutas
// app.use('/api/users', userRoutes);
// app.use('/api/cards', cardRoutes);
app.use('/api/series', serieRouter);
app.use('/api/sets', setRouter);


app.get('/', (req, res) => {
  res.send('API del servidor de Pokémon TCG funcionando');
});

// --- Manejo de Errores (Ejemplo básico) ---
// Puedes añadir un middleware de manejo de errores más robusto aquí

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});