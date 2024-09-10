import Note, { INote } from '../models/note.model';
import { Request, Response, NextFunction } from 'express';
import ExcelJS from 'exceljs';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
import { exportNotesToExcel } from '../controllers/note.comtrollers';

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


    
    async addNote(userData: {
        title:string,
         content:string,
          categorie:string, 
          user:string
    
    }): Promise<{  message: string }> {
        const { title, content, categorie, user } = userData;
        const isnote=await Note.findOne({title});
        console.log(isnote)
        if(isnote){
            return {  message: 'note exist !'}
        }
        const newNote:INote = new Note({  title, content, categorie, user});
        await newNote.save();

        return {
           
            message: 'note registered successfully.'
        };
    }

    async getAllNote(): Promise<{ allNote: INote[]}> {
        const allNote = await Note.find()
        .populate('categorie', 'name -_id')
        .populate('user', 'username email  -_id');

        return {
           allNote
          }
    }

    async getNoteById( userData:{id:string}): Promise<{ note: INote |null }> {
        try {
            const id=userData;
            const note = await Note.findById(id)
                .populate('categorie', 'name -_id')
                .populate('user', 'username email -_id');
    
            if (!note) {
                // Handle the case where the note is not found
                return { note: null }; // or throw an error depending on your use case
            }
    
            return {
                note: note
            };
        } catch (error) {
            // Handle errors that occur during the database operation
            console.error('Error fetching note:', error);
            throw new Error('Failed to fetch note');
        }
    }


    
    async updateNoteById(userData: { id:string, title:string, content:string }): Promise<{ note: INote}> {

    const { id, title, content } = userData;

    // Find the note by ID
    const note = await Note.findByIdAndUpdate(id);

    // Check if the note exists
    if (!note) {
        throw new Error('Category not found');
    }
    note.title = title;
    note.content = content;
   

    // Save the updated note
    await note.save();

    // Return the updated note
    return {
        note
    };
    }

    async deleteNoteById( userData:{id:string}): Promise<{ note: INote}> {

        // Find the note by ID
        const idd=userData;
        const note = await Note.findByIdAndDelete(idd);
    
        // Check if the note exists
        if (!note) {
            throw new Error('note not found');
        }
        // Save the updated note
        console.log(note)
        // await note.save();
    
        // Return the updated note
        return {
            note
        };
        }
        
        async exportNotesToExcel(req: Request, res: Response){
           
            try {
                // Fetch all notes from the database
                const notes = await Note.find()
                    .populate('categorie', 'name -_id')
                    .populate('user', 'username email -_id') as INote[]; // Ensure casting
        
                if (!notes || notes.length === 0) {
                    return res.status(404).send('No notes found');
                }
        
                // Create a new workbook and worksheet
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Notes');
        
                // Define the columns for the worksheet
                worksheet.columns = [
                    { header: 'Title', key: 'title', width: 30 },
                    { header: 'Content', key: 'content', width: 30 },
                    { header: 'Category', key: 'category', width: 30 },
                    { header: 'User', key: 'user', width: 30 },
                    { header: 'Created At', key: 'createdAt', width: 40 },
                    { header: 'Updated At', key: 'updatedAt', width: 40 }
                ];
        
                // Add rows to the worksheet
                notes.forEach(note => {
                    worksheet.addRow({
                        title: note.title,
                        content: note.content,
                        category: note.categorie ? (note.categorie ).name : 'N/A',
                        user: note.user ? `${(note.user ).username} (${(note.user ).email})` : 'N/A',
                        createdAt: note.createdAt.toISOString(),
                        updatedAt: note.updatedAt.toISOString()
                    });
                });
        
                // Set the response headers for file download
                res.setHeader('Content-Disposition', 'attachment; filename=notes.xlsx');
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
                // Write the workbook to the response stream
                await workbook.xlsx.write(res);
        
                // End the response
                res.end();
            } catch (error) {
                console.error('Error exporting notes to Excel:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }

}



export default new NoteService();