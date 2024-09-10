import express from 'express';
import {addCategorie,getAllCategorie,updateCategorieById,deleteCategorieById} from '../controllers/categorie.controllers';
import {authMiddleware} from '../middlewares/auth'
const router = express.Router();

router.post('/ADD_CATEGORY', addCategorie);
router.post('/GET_ALL_CATEGORIES', getAllCategorie);
router.post('/UPDATE_CATEGORY_BY_ID', updateCategorieById);
router.post('/DELETE_CATEGORY_BY_ID', deleteCategorieById);
export default router;