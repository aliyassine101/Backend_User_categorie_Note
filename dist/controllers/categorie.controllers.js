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
exports.deleteCategorieById = exports.updateCategorieById = exports.getAllCategorie = exports.addCategorie = void 0;
const categorie_service_1 = __importDefault(require("../services/categorie.service"));
const categorie_model_1 = __importDefault(require("../models/categorie.model"));
// Example POST endpoint to create a new category
const addCategorie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, user } = req.body;
        if (!name || !user) {
            return res.status(400).json({ message: 'Name and user are required.' });
        }
        const newCategorie = new categorie_model_1.default({ name, user });
        yield newCategorie.save();
        return res.status(201).json(newCategorie);
    }
    catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'An error occurred while creating the category', error });
    }
});
exports.addCategorie = addCategorie;
const getAllCategorie = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        categorie_service_1.default;
        const result = yield categorie_model_1.default.find()
            .populate('user', 'username email  -_id');
        // Ensure `result` is defined and contains the data you're expecting
        if (!result) {
            return res.status(404).json({ message: 'Categories not found' });
        }
        return res.status(200).json(result); // Use 200 for successful GET requests
    }
    catch (error) {
        // Log the error for debugging
        console.error('Error fetching categories:', error);
        // Return a proper error response
        return res.status(500).json({ message: 'An error occurred while fetching categories', error });
    }
});
exports.getAllCategorie = getAllCategorie;
const updateCategorieById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name } = req.body;
        const categorie = yield categorie_model_1.default.findById(id); // Modify query as needed
        if (!categorie) {
            throw new Error('categorie not found');
        }
        categorie.name = name;
        categorie.save();
        return res.status(200).json(categorie);
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching categories', error });
    }
});
exports.updateCategorieById = updateCategorieById;
const deleteCategorieById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const categorie = yield categorie_model_1.default.findByIdAndDelete(id); // Modify query as needed
        if (!categorie) {
            throw new Error('categorie not found');
        }
        categorie.save();
        return res.status(200).json(categorie);
    }
    catch (error) {
        return res.status(500).json({ message: 'An error occurred while fetching categories', error });
    }
});
exports.deleteCategorieById = deleteCategorieById;
