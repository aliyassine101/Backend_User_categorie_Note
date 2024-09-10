import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import User, { IUser } from '../models/user.model';
import userId from '../types/express'
export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        username,
        email,
        password,
      } = req.body;
  
      const result = await UserService.signup({
        username,
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
        const {email, password } = req.body;
    
        const result = await UserService.signin(email, password);
        res.json(result);
      } catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        next(error);
      }
};


export const getProfiles= async (req:Request, res:Response) => {
  
  try {

    const id = req.userId;        

    console.log(id)
    const profile = await UserService.getProfile(id);
    res.status(200).send(profile); // Respond with the profile data
} catch (error: unknown) {
  // Type assertion to check if the error is an instance of Error
  if (error instanceof Error) {
      res.status(404).send({ message: error.message }); // Handle known errors
  } else {
      // Handle unknown errors
      res.status(500).send({ message: 'An unexpected error occurred' });
  }
}
}


export const resetPassword= async (req:Request, res:Response) => {
  
  try {
    const { email,newpassword} = req.body; 
    console.log('the pass: '+newpassword) ;

    const user = await UserService.resetPassword(email,newpassword);
    console.log('before display');
    res.status(200).send(user); // Respond with the profile data
} catch (error: unknown) {
  // Type assertion to check if the error is an instance of Error
  if (error instanceof Error) {
      res.status(404).send({ message: error.message }); // Handle known errors
  } else {
      // Handle unknown errors
      res.status(500).send({ message: 'An unexpected error occurred' });
  }
}
}




