import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/environment';
import authRoutes from './routes/user.routes';
import categorieRoutes from './routes/categorie.route';
import noteRoutes from './routes/note.route';
const nodemailer = require("nodemailer");
import { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import User, { IUser } from './models/user.model';
import bcrypt from 'bcrypt';



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/categorie',categorieRoutes);
app.use('/note',noteRoutes);

export default app;