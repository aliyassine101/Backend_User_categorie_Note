import express from 'express';
import { ROUTES } from '../constants/routesConstants'
import { signup, signin } from '../controllers/user.controller';
const router = express.Router();

router.post(ROUTES.SIGNIN, signin);
router.post(ROUTES.SIGNUP, signup);

export default router;