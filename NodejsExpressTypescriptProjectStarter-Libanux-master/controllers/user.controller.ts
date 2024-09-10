import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
      } = req.body;
  
      const result = await UserService.signup({
        email,
        password
      });
  
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User already exists') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  };

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
    
        const result = await UserService.signin(email, password);
    
        res.json(result);
      } catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        next(error);
      }
};