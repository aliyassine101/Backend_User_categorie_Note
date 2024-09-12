import express from 'express';
import { ROUTES } from '../constants/routesConstants'
import { signup, signin ,getProfiles, resetPassword} from '../controllers/user.controller';
import {authMiddleware} from '../middlewares/auth'
import bodyParser from 'body-parser';
const nodemailer = require("nodemailer");
import crypto from 'crypto';

const router = express.Router();

router.post(ROUTES.SIGNIN, signin);
router.post(ROUTES.SIGNUP, signup);
router.post('/GET_PROFILE_BY_ID_USER',authMiddleware, getProfiles);
router.post('/RESET_PASSWORD_USER', resetPassword);




export default router;