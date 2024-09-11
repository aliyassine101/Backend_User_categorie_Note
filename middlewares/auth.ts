import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment'; // Ensure this path is correct

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Use 'authorization' in lowercase as it appears in headers
  const token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Decode token
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    req.userId = decoded.userId; // Ensure Request interface is extended
    next();    
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
