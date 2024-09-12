import express from 'express';
import {addCategorie,getAllCategorie,updateCategorieById,deleteCategorieById} from '../controllers/categorie.controllers';
import {authMiddleware} from '../middlewares/auth'
const router = express.Router();

router.post('/ADD_CATEGORY',authMiddleware, addCategorie);
router.post('/GET_ALL_CATEGORIES',authMiddleware, getAllCategorie);
router.post('/UPDATE_CATEGORY_BY_ID',authMiddleware, updateCategorieById);
router.post('/DELETE_CATEGORY_BY_ID',authMiddleware, deleteCategorieById);
export default router;