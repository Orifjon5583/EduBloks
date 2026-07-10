import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; login: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) { res.status(401).json({ message: 'Token kerak' }); return; }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    next();
  } catch { res.status(401).json({ message: 'Token yaroqsiz' }); }
};

export const authorize = (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ message: 'Ruxsat yo\'q' }); return;
  }
  next();
};
