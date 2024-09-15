import { Request, Response, NextFunction } from 'express';
import Note, { INote } from '../models/note.model';
import NoteService from '../services/note.service';
import ExcelJS from 'exceljs';
// Example POST endpoint to create a new category
export const addNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, content, categorie } = req.body;
        const user=req.userId;

        if (!title || !categorie || !user) {
            return res.status(400).json({ message: 'title and categorie and user are required.' });
        }

        const newNote = await NoteService.addNote({title, content, categorie, user})
        console.log(newNote)
    
        return res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'An error occurred while creating the category', error });
    }
};

export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;

        // Ensure `page` and `limit` are positive integers
        if (page < 1 || limit < 1) {
            return res.status(400).json({ message: 'Page and limit must be greater than 0.' });
        }

        const result = await NoteService.getAllNote(page, limit);   

        if (!result) {
            return res.status(404).json({ message: 'Notes not found' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching notes:', error);
        return res.status(500).json({ message: 'An error occurred while fetching notes', error });
    }
};


export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;
        const result = await NoteService.getNoteById(id);
           
        // Ensure `result` is defined and contains the data you're expecting
        if (!result) {
            return res.status(404).json({ message: 'notes not found' });
        }

        return res.status(200).json(result); // Use 200 for successful GET requests
    } catch (error: unknown) {
        // Log the error for debugging
        console.error('Error fetching notes:', error);

        // Return a proper error response
        return res.status(500).json({ message: 'An error occurred while fetching notes ', error });
    }
};


export const updateNoteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, title, content } = req.body;
        const note = await NoteService.updateNoteById({id,title,content}); // Modify query as needed

        if (!note) {
            throw new Error('categorie not found');
        }
       
        return res.status(200).json(note);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching categories', error });
    }
}



export const deleteNoteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the ID from the request body
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        // Call the service method to delete the note
        const result = await NoteService.deleteNoteById(id);

        // Check if the delete operation was successful
        if (!result) {
            return res.status(404).json({ message: 'Note not found or already deleted' });
        }

        // Return success response
        return res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        // Log the error for debugging
        console.error('Error deleting note:', error);

        // Return a proper error response
        return res.status(500).json({ message: 'An error occurred while deleting the note', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

    // POST /search_and_filter_notes


export const search_and_filter_notes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract parameters from the request body
        const { searchTerm, exclude, sortBy = 'createdAt', sortOrder = 'desc' } = req.body;
          const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;


        // Initialize the query object
        const query: any = {};

        // Handle the search term if provided
        if (searchTerm) {
            const searchRegExp = new RegExp(searchTerm, 'i'); // Case-insensitive search
            query.$or = [
                { title: searchRegExp },
                { content: searchRegExp }
            ];
        }

        // Handle exclusions if provided
        if (exclude) {
            const excludeTerms: RegExp[] = exclude.split(',').map((term: string) => new RegExp(term.trim(), 'i'));
            query.$and = [
                ...(query.$and || []), // Preserve existing $and conditions if any
                { title: { $not: { $in: excludeTerms } } },
                { content: { $not: { $in: excludeTerms } } }
            ];
        }

        // Fetch the results using the NoteService
        const result = await NoteService.search_and_filter_notes(query, sortBy, sortOrder, page, limit);

        // Send the response
        res.json({ result });
    } catch (error) {
        console.error('Error searching and filtering notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

    
// Function to export notes to Excel
export async function exportNotesToExcel(req: Request, res: Response) {
 NoteService.exportNotesToExcel(req, res);
} 