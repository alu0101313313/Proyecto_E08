import express from 'express';
import type { ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
import connectDB from './app/lib/db/connectDB';
import authRoutes from './app/auth/authRoutes'; 


// variables de entorno
dotenv.config();

// base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
// parsear JSON del body
app.use(express.json());
// parsear URL-encoded data
app.use(express.urlencoded({ extended: true }));
// parsear las cookies
app.use(cookieParser());

// rutas API 
// /api/auth/login, /api/auth/register
app.use('/api/auth', authRoutes);

// Otras rutas 
// app.use('/api/users', userRoutes);
// app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
  res.send('API del servidor de Pokémon TCG funcionando');
});

// manejador de errores 
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});