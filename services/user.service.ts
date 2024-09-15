import User, { IUser } from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: "f39aac2e076229fc6b302cce3bf52e8f"
    }
  });

class UserService {

    async signin(email: string, password: string): Promise<{
        message: string;
        token: string;
        user: IUser; 
    }> {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user._id },
            config.jwtSecret,
            { expiresIn: '1d' }
        ); 

        await user.save();

        return {
            message: 'Login successful',
            token,
            user: user
        };
    }

    async signup(userData: {
        username:string,
        email: string;
        password: string;
    }): Promise<{ user: IUser; message: string }> {
        const {username, email, password } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Create new user
        const user: IUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // Save user to database
        await user.save();

        return {
            user: user,
            message: 'User registered successfully.'
        };
    }

    

    async getProfile(id:any): Promise<{ user: IUser,token:string ,password:string}> {
        console.log(id)
        // Fetch a single user or apply your specific query
        const user = await User.findById(id); // Modify query as needed

        if (!user) {
            throw new Error('User not found');
        }

        const token = jwt.sign(
            { userId: user._id },
            config.jwtSecret,
            { expiresIn: '1d' }
        ); 
        const password=user.password
        await user.save();
        return { user ,
            token,
            password
        }; // Return user wrapped in an object
    }


  async requestpasswordreset(email:string):Promise<{verificationCode:string}>{
    
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw 'No user found with this email.';
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
    console.log(verificationCode)
   return{
    verificationCode:verificationCode
   }
  } catch (error) {
    console.log('error :'+error)
  throw ('Server error.');
  }
  }

  async resetpassword(email:string, verificationCode:string, newPassword:string):Promise<{message:string}>{
  try {
    const user = await User.findOne({
      email,
      verificationCode,
      verificationCodeExpires: { $gt: Date.now() },
    });

    if (!user) {
   throw 'Invalid or expired verification code.';
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    return{
        message:'Password has been reset successfully.'
    }
  } catch (error) {
  throw ('Server error.');
  }
  }

}

export default new UserService();