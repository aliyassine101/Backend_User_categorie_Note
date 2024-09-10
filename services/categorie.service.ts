import Categorie, { ICategorie } from '../models/categorie.model';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import mongoose, { Schema, Document } from 'mongoose';
import { IconSetRuleType } from 'exceljs';

class CategorieService {

   
    async addCategorie(userData: {
        user:string,
        name: string;
    
    }): Promise<{ categorie: ICategorie; message: string }> {
        const {user, name } = userData;

        const newCategorie:ICategorie = new Categorie({ name, user });
        await newCategorie.save();

        return {
            categorie:newCategorie,
            message: 'categorie registered successfully.'
        };
    }


    async getAllCategorie(): Promise<{ allcategorie: ICategorie[]}> {
        const allcategorie = await Categorie.find()
        .populate('user','username email  -_id');

        return {
           allcategorie
          }
    }


    async updateCategorieById(userData: { id:string,
        name: string; }): Promise<{ allcategorie: ICategorie}> {

           const { id, name } = userData;

    // Find the category by ID
    const allcategorie = await Categorie.findById(id);

    // Check if the category exists
    if (!allcategorie) {
        throw new Error('Category not found');
    }

    // Update the category name
    allcategorie.name = name;

    // Save the updated category
    await allcategorie.save();

    // Return the updated category
    return {
        allcategorie
    };
    }


    async deleteCategorieById(  userData:{id:string}): Promise<{ allcategorie: ICategorie}> {

           const  idd  = userData;
           console.log('delete')

    // Find the category by ID
    const allcategorie = await Categorie.findByIdAndDelete(idd);

    // Check if the category exists
    if (!allcategorie) {
        throw new Error('Category not found');
    }

    // Save the updated category
    await allcategorie.save();

    // Return the updated category
    return {
        allcategorie
    };
    }

}




    

   







export default new CategorieService();