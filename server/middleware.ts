import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_123';

// --- Authentication Middleware ---
export const requireAuth = (req: Request, res: Response, next: (err?: any) => void) => {
  const authHeader = (req as any).headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return (res as any).status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return (res as any).status(403).json({ success: false, error: 'Forbidden: Invalid token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: (err?: any) => void) => {
  const user = (req as any).user;
  if (!user || user.role !== 'admin') {
    return (res as any).status(403).json({ success: false, error: 'Forbidden: Admin access required' });
  }
  next();
};

// --- Error Handling Middleware ---
export const errorHandler = (err: any, req: Request, res: Response, next: (err?: any) => void) => {
  console.error('Unhandled Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  (res as any).status(statusCode).json({
    success: false,
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};