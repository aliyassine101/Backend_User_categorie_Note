import { Request, Response, NextFunction } from 'express';
import CategorieService from '../services/categorie.service';
import Categorie, { ICategorie } from '../models/categorie.model';

// Example POST endpoint to create a new category
export const addCategorie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const user=req.userId;

        if (!name || !user) {
            return res.status(400).json({ message: 'Name and user are required.' });
        }

        const newCategorie = await CategorieService.addCategorie({
            user,name
        })
        console.log(newCategorie)
        
        return res.status(201).json(newCategorie);
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'An error occurred while creating the category', error });
    }
};


  export const getAllCategorie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await CategorieService.getAllCategorie();
        

        // Ensure `result` is defined and contains the data you're expecting
        if (!result ) {
            return res.status(404).json({ message: 'Categories not found' });
        }

        return res.status(200).json(result); // Use 200 for successful GET requests
    } catch (error:unknown) { 
        // Log the error for debugging
        console.error('Error fetching categories:', error);

        // Return a proper error response
        return res.status(500).json({ message: 'An error occurred while fetching categories',error });
    }
};
   
  export const updateCategorieById=async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const {id,name}=req.body;
        const categorie = await CategorieService.updateCategorieById({id,name}); // Modify query as needed

    if (!categorie) {
        throw new Error('categorie not found');
    }
    
    return res.status(200).json(categorie); 
    }catch(error){
        return res.status(500).json({ message: 'An error occurred while fetching categories',error });
    }
  }

   
  export const deleteCategorieById=async (req: Request, res: Response, next: NextFunction)=>{
    try{
        const {id}=req.body;
        const categorie = await CategorieService.deleteCategorieById(id); // Modify query as needed

    if (!categorie) {
        throw new Error('categorie not found'); 
    }
    
    return res.status(200).json(categorie); 
    }catch(error){
       
        return res.status(500).json({ message: 'An error occurred while fetching categories',error });
    }
  }
