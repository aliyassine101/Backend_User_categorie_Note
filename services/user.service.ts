import User, { IUser } from '../models/user.model';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment';

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


    
    async resetPassword(email:string,newPassword:string): Promise<{ user: IUser }> {
         console.log('Email:', email);
    console.log('New Password:', newPassword);
    
    // Fetch the user by email
    const user = await User.findOne({ email: email }); // Modify query as needed

    if (!user) {
        throw new Error('User not found');
    }

    try {
       

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        console.log('Generated Salt:', salt); // Log salt value
        
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('Hashed Password:', hashedPassword); // Log hashed password

        user.password = hashedPassword;
        await user.save();

        return { user 
        }; // Return user wrapped in an object
    } catch (err:unknown) {
        throw new Error('Error hashing password: ' + err);
    }}

}

export default new UserService();