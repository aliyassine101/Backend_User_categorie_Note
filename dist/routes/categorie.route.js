"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categorie_controllers_1 = require("../controllers/categorie.controllers");
const router = express_1.default.Router();
router.post('/ADD_CATEGORY', categorie_controllers_1.addCategorie);
router.post('/GET_ALL_CATEGORIES', categorie_controllers_1.getAllCategorie);
router.post('/UPDATE_CATEGORY_BY_ID', categorie_controllers_1.updateCategorieById);
router.post('/DELETE_CATEGORY_BY_ID', categorie_controllers_1.deleteCategorieById);
exports.default = router;
