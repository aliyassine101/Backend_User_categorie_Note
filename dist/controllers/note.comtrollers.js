"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search_and_filter_notes = exports.deleteNoteById = exports.updateNoteById = exports.getNoteById = exports.getAllNotes = exports.addNote = void 0;
exports.exportNotesToExcel = exportNotesToExcel;
const note_model_1 = __importDefault(require("../models/note.model"));
const note_service_1 = __importDefault(require("../services/note.service"));
const exceljs_1 = __importDefault(require("exceljs"));
// Example POST endpoint to create a new category
const addNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, categorie, user } = req.body;
        if (!title || !categorie || !user) {
            return res.status(400).json({ message: 'title and categorie and user are required.' });
        }
        const newNote = new note_model_1.default({ title, content, categorie, user });
        yield newNote.save();
        return res.status(201).json(newNote);
    }
    catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'An error occurred while creating the category', error });
    }
});
exports.addNote = addNote;
const getAllNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield note_model_1.default.find()
            .populate('categorie', 'name -_id')
            .populate('user', 'username email  -_id');
        // Ensure `result` is defined and contains the data you're expecting
        if (!result) {
            return res.status(404).json({ message: 'notes not found' });
        }
        return res.status(200).json(result); // Use 200 for successful GET requests
    }
    catch (error) {
        // Log the error for debugging
        console.error('Error fetching notes:', error);
        // Return a proper error response
        return res.status(500).json({ message: 'An error occurred while fetching notes ', error });
    }
});
exports.getAllNotes = getAllNotes;
const getNoteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const result = yield note_model_1.default.findById(id)
            .populate('categorie', 'name -_id')
            .populate('user', 'username email  -_id');
        // Ensure `result` is defined and contains the data you're expecting
        if (!result) {
            return res.status(404).json({ message: 'notes not found' });
        }
        return res.status(200).json(result); // Use 200 for successful GET requests
    }
    catch (error) {
        // Log the error for debugging
        console.error('Error fetching notes:', error);
        // Return a proper error response
        return res.status(500).json({ message: 'An error occurred while fetching notes ', error });
    }
});
exports.getNoteById = getNoteById;
const updateNoteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, title, content } = req.body;
        const note = yield note_model_1.default.findByIdAndUpdate(id); // Modify query as needed
        if (!note) {
            throw new Error('categorie not found');
        }
        note.title = title;
        note.content = content;
        note.save();
        return res.status(200).json(note);
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching categories', error });
    }
});
exports.updateNoteById = updateNoteById;
const deleteNoteById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const note = yield note_model_1.default.findByIdAndDelete(id); // Modify query as needed
        if (!note) {
            throw new Error('categorie not found');
        }
        note.save();
        return res.status(200).json(note);
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching categories', error });
    }
});
exports.deleteNoteById = deleteNoteById;
// POST /search_and_filter_notes
const search_and_filter_notes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract search and filter parameters from the request body
        const { title, content, categorie, user, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = req.body;
        // Build the query object
        const query = {};
        if (title) {
            query.title = new RegExp(title, 'i'); // Case-insensitive search for title
        }
        if (content) {
            query.content = new RegExp(content, 'i'); // Case-insensitive search for content
        }
        if (categorie) {
            query.categorie = categorie; // Filter by category
        }
        if (user) {
            query.user = user; // Filter by user
        }
        const result = yield note_service_1.default.search_and_filter_notes(query, sortBy, sortOrder, page, limit);
        res.json({ result });
    }
    catch (error) {
        console.error('Error searching and filtering notes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.search_and_filter_notes = search_and_filter_notes;
// Function to export notes to Excel
function exportNotesToExcel(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch all notes from the database
            const notes = yield note_model_1.default.find()
                .populate('categorie', 'name -_id')
                .populate('user', 'username email -_id');
            // Create a new workbook and worksheet
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet('Notes');
            // Define the columns for the worksheet
            worksheet.columns = [
                { header: 'Title', key: 'title', width: 30 },
                { header: 'Content', key: 'content', width: 50 },
                { header: 'Categorie', key: 'categorie', width: 30 },
                { header: 'User', key: 'user', width: 30 },
                { header: 'Created At', key: 'createdAt', width: 20 },
                { header: 'Updated At', key: 'updatedAt', width: 20 }
            ];
            // Add rows to the worksheet
            notes.forEach(note => {
                worksheet.addRow({
                    title: note.title,
                    content: note.content,
                    categorie: note.categorie ? note.categorie : 'N/A',
                    user: note.user ? `${note.user} (${note.user})` : 'N/A',
                    createdAt: note.createdAt.toISOString(),
                    updatedAt: note.updatedAt.toISOString()
                });
            });
            // Set the response headers for file download
            res.setHeader('Content-Disposition', 'attachment; filename=notes.xlsx');
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            // Write the workbook to the response stream
            yield workbook.xlsx.write(res);
            // End the response
            res.end();
        }
        catch (error) {
            console.error('Error exporting notes to Excel:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
