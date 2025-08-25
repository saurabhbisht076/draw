import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticationError } from 'apollo-server-express';
import { config } from '../config/environment';
import { User } from '../models/user.model';

export const authMiddleware = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

export const verifyToken = (token: string): { id: string } => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as { id: string };
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};