import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// mocks
const mocks = vi.hoisted(() => ({
  findById: vi.fn(),
}));

vi.mock('../../../src/app/models/userModel', () => ({
  default: {
    findById: mocks.findById,
  },
}));

import { protect } from '../../../src/app/middleware/authMiddleware';

describe('Auth Middleware (protect)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { 
      cookies: {}, // cookies vacías por defecto
      headers: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    process.env.JWT_SECRET = 'test_secret'; // secreto de prueba
  });

  it('debería devolver 401 si no hay token en las cookies', async () => {
    req.cookies = {}; // sin token

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const error = (next as any).mock.calls[0][0];
    expect(error.message).toBe('No autorizado, no hay token');
  });

  it('debería devolver 401 si el token es inválido o ha expirado', async () => {
    req.cookies = { jwt: 'invalid_token' };
    
    // jwt.verify lanza un error
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('invalid token');
    });

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const error = (next as any).mock.calls[0][0];
    expect(error.message).toBe('No autorizado, token fallido');
  });

  it('debería devolver 401 si el token es válido pero el usuario ya no existe en BD', async () => {
    req.cookies = { jwt: 'valid_token' };
    
    // token válido
    vi.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user_123' } as any);
    
    // usuario no encontrado
    mocks.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue(null) 
    });

    await protect(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const error = (next as any).mock.calls[0][0];
    expect(error.message).toBe('No autorizado, token fallido');
  });

  it('debería llamar a next() y adjuntar el usuario si todo es correcto', async () => {
    req.cookies = { jwt: 'valid_token' };
    const mockUser = { _id: 'user_123', username: 'Ash' };

    // token válido
    vi.spyOn(jwt, 'verify').mockReturnValue({ userId: 'user_123' } as any);

    // usuario encontrado
    mocks.findById.mockReturnValue({
      select: vi.fn().mockResolvedValue(mockUser)
    });

    await protect(req as Request, res as Response, next);

    // checks
    expect(res.status).not.toHaveBeenCalled(); // no debe enviar error
    expect((req as any).user).toEqual(mockUser); // req.user debe estar relleno
    expect(next).toHaveBeenCalled(); // debe pasar al siguiente middleware
    expect(next).not.toHaveBeenCalledWith(expect.any(Error)); // sin argumentos de error
  });
});