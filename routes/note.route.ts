import express , { Request, Response } from 'express';
import {addNote,getAllNotes,getNoteById,updateNoteById,deleteNoteById,search_and_filter_notes,exportNotesToExcel} from '../controllers/note.comtrollers';
import {authMiddleware} from '../middlewares/auth'
const router = express.Router();
import Note from '../models/note.model';

router.post('/ADD_NOTE', authMiddleware,addNote);
router.post('/GET_ALL_NOTES',authMiddleware, getAllNotes);
router.post('/GET_NOTE_BY_ID', authMiddleware,getNoteById);
router.post('/UPDATE_NOTE_BY_ID',authMiddleware, updateNoteById); 
router.post('/DELETE_NOTE_BY_ID',authMiddleware, deleteNoteById);
router.post('/SEARCH_AND_FILTER_NOTES', authMiddleware,search_and_filter_notes);
router.get('/EXPORT_NOTES_TO_EXCEL', exportNotesToExcel);





export default router;


