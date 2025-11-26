import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel'; 
import type { IUser } from '../interface/IUsers';

// extendemos para incluir la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * @desc    Middleware para proteger rutas
 * Verifica el JWT de la cookie y adjunta el usuario a req.user
 */
export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  // opcion a: buscar en el header Authorization: Bearer <token>.
  // esto significa que el token se envía en el encabezado de autorización de la solicitud HTTP.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraer token del encabezado
      token = req.headers.authorization.split(' ')[1];
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido');
      }
      // Verificar el token
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;
      
      // Obtener el usuario de la BD usando el ID del token
      // Usamos .select('-password') para excluir el hash de la contraseña
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('No autorizado, usuario no encontrado');
      }
      // Llamar al siguiente middleware
      next();
      return; // importante para evitar continuar al final
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('No autorizado, token fallido');
    }
  }
  // opcion b: buscar en la cookie 'jwt'
  if (!token && req.cookies && req.cookies.jwt) {
    try {
      // 1. Leer el token de la cookie 'jwt'
      token = req.cookies.jwt;
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está definido');
      }
      const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('No autorizado, usuario no encontrado');
      }
      next();
      return;
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('No autorizado, token fallido');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('No autorizado, no hay token');
  }
});

// las dos opciones que se han realizado es para:
// 1. permitir que el cliente envíe el token en el encabezado Authorization (útil para APIs y clientes externos)
// este caso es ideal para aplicaciones móviles o clientes que no manejan cookies automáticamente.
// 2. permitir que el cliente envíe el token en una cookie (útil para aplicaciones web donde el navegador maneja las cookies automáticamente)
