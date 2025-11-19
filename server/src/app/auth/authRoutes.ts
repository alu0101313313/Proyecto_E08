import  { Router } from 'express';
import type { Request, Response } from 'express';
import { registerUser } from './register.controller';
import { loginUser } from './login.controller';

const router = Router();

// Ruta para registrar un nuevo usuario
// POST /api/auth/register
router.post('/register', registerUser);

// Ruta para iniciar sesión
// POST /api/auth/login
router.post('/login', loginUser);

// Ruta para cerrar sesión
// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  // Limpiamos la cookie 'jwt' enviando una cookie expirada
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Expira inmediatamente
  });
  res.status(200).json({ message: 'Sesión cerrada exitosamente' });
});

export default router;