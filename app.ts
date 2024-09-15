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




app.post('/reset-password', async (req: Request, res: Response) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      verificationCode,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send('Invalid or expired verification code.');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.status(200).send('Password has been reset successfully.');
  } catch (error) {
    res.status(500).send('Server error.');
  }
});
export default app;