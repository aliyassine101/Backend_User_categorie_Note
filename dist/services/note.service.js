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
const note_model_1 = __importDefault(require("../models/note.model"));
class NoteService {
    search_and_filter_notes(query, sortBy, sortOrder, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            // Define sorting options
            const sortOptions = {};
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            // Define pagination options
            const pageNumber = parseInt(page, 10);
            const pageSize = parseInt(limit, 10);
            // Find notes with pagination and sorting
            const note = yield note_model_1.default.find(query)
                .populate('categorie', 'name -_id')
                .populate('user', 'username email  -_id')
                .sort(sortOptions)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize);
            // Count total matching notes for pagination
            const totalNotes = yield note_model_1.default.countDocuments(query);
            return {
                note: note,
                totalPages: Math.ceil(totalNotes / pageSize),
                currentPage: pageNumber,
                totalNotes
            };
        });
    }
}
exports.default = new NoteService();
