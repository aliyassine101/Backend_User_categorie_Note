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





const transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "f39aac2e076229fc6b302cce3bf52e8f"
  }
});

// Request password reset
app.post('/request-password-reset', async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send('No user found with this email.');
    }

    const verificationCode = crypto.randomInt(100000, 999999).toString(); // 6-digit code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 3600000); // 1 hour expiration
    await user.save();

    console.log(user.verificationCode);

    const mailOptions = {
      from:"mailtrap@demomailtrap.com" ,
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Use the following code to reset your password: ${verificationCode}`,
    };

    await transport.sendMail(mailOptions);
    res.status(200).send(verificationCode);
  } catch (error) {
    console.log('error :'+error)
    res.status(500).send('Server error.');
  }
});







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