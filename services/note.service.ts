import Note, { INote } from '../models/note.model';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

class NoteService {

    async search_and_filter_notes(query:any, sortBy:any,sortOrder:any,page:any,limit:any): Promise<{
       
        note: INote[];
        totalPages:Number;
        currentPage:Number;
        totalNotes:Number;

    }> {
        // Define sorting options
        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Define pagination options
        const pageNumber = parseInt(page as unknown as string, 10);
        const pageSize = parseInt(limit as unknown as string, 10);

        // Find notes with pagination and sorting
        const note = await Note.find(query)
        .populate('categorie', 'name -_id')
        .populate('user', 'username email  -_id')
        .sort(sortOptions)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize);

        // Count total matching notes for pagination
        const totalNotes = await Note.countDocuments(query);
    
        return{
            note:note,
            totalPages: Math.ceil(totalNotes / pageSize),
            currentPage: pageNumber,
            totalNotes
        }
    }
}

export default new NoteService();