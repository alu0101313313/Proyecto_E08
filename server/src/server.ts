// server.ts
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './app/lib/db/connectDB';
import authRoutes from './app/auth/authRoutes';
import { serieRouter } from './app/routers/serieRouter';
import { setRouter } from './app/routers/setRouter';
import { cardRouter } from './app/routers/cardRouter';
import { collectionRouter } from './app/routers/collectionRouter';
import { wishlistRouter } from './app/routers/wishlistRouter';
import { userRouter } from './app/routers/userRouter';
import { conversationRouter } from './app/routers/conversationRouter';
import executeTradeRouter from './app/routers/executeTradeRouter';
import type { ErrorRequestHandler } from 'express';
import type { IChatSocketMessage } from './app/interface/IChatSocketMessage';
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000;
// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// CORS configuration para permitir cookies en requests cross-origin
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.CLIENT_ORIGIN || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// rutas
app.use('/api/auth', authRoutes);
app.use('/api', collectionRouter);
app.use('/api', serieRouter);
app.use('/api', setRouter);
app.use('/api', cardRouter);
app.use('/api', wishlistRouter);
app.use('/api', userRouter);
app.use('/api', conversationRouter);
app.use('/api/execute-trade', executeTradeRouter);
app.get('/', (req, res) => {
  res.send('API del servidor de Pokémon TCG funcionando');
});
// manejador de errores
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
app.use(errorHandler);
// --- HTTP server + Socket.IO ---
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', process.env.CLIENT_ORIGIN || 'http://localhost:3000'],
    credentials: true,
  },
});
// exportar io si lo quieres usar en otros módulos
export { io };
// listeners de conexión
io.on('connection', (socket) => {
  // unirse a la sala de chat de un trade
  socket.on('trade:join', ({ roomId }) => {
    socket.join(roomId);
    // Notificar a otros en la sala que alguien se unió
    socket.to(roomId).emit('user:joined', { userId: socket.id });
  });
  // unirse a un canal de notificaciones personal
  socket.on('user:subscribe', ({ userId }) => {
    socket.join(`user:${userId}`);
  });
  // recibir mensajes de chat / propuesta
  socket.on('trade:message', async (msg: IChatSocketMessage) => {
    // Guardar en la base de datos de forma asíncrona
    if (msg.toUserId && msg.fromUserId && !msg.meta?.skipPersist) {
      try {
        const response = await fetch(`${process.env.API_URL || 'http://localhost:5000'}/api/conversations/${msg.toUserId}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `userId=${msg.fromUserId}`
          },
          body: JSON.stringify({
            kind: msg.kind,
            payload: msg.payload
          })
        });
        if (response.ok) {
        } else {
          console.error('Error guardando mensaje en BD:', response.statusText);
        }
      } catch (error) {
        console.error('Error al guardar mensaje en BD:', error);
      }
    }
    // broadcast a TODOS en la sala, incluyendo al que envía
    io.to(msg.roomId).emit('trade:sync', msg);
    // También enviar notificación personal al usuario destinatario
    if (msg.toUserId) {
      io.to(`user:${msg.toUserId}`).emit('trade:sync', msg);
    } else {
    }
  });
  socket.on('disconnect', () => {
  });
});
httpServer.listen(PORT, () => {
});
