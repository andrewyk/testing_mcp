import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AppError } from './errorHandler';
import { User } from '../models';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      
      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'email', 'role'],
      });

      if (!user) {
        return next(new AppError('User no longer exists', 401));
      }

      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      return next(new AppError('Invalid token', 401));
    }
  } catch (error) {
    next(error);
  }
};
