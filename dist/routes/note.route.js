"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_comtrollers_1 = require("../controllers/note.comtrollers");
const router = express_1.default.Router();
router.post('/ADD_NOTE', note_comtrollers_1.addNote);
router.post('/GET_ALL_NOTES', note_comtrollers_1.getAllNotes);
router.post('/GET_NOTE_BY_ID', note_comtrollers_1.getNoteById);
router.post('/UPDATE_NOTE_BY_ID', note_comtrollers_1.updateNoteById);
router.post('/DELETE_NOTE_BY_ID', note_comtrollers_1.deleteNoteById);
router.post('/SEARCH_AND_FILTER_NOTES', note_comtrollers_1.search_and_filter_notes);
router.post('/EXPORT_NOTES_TO_EXCEL', note_comtrollers_1.exportNotesToExcel);
exports.default = router;
