"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
class UserService {
    signin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, environment_1.config.jwtSecret, { expiresIn: '1d' });
            yield user.save();
            return {
                message: 'Login successful',
                token,
                user: user
            };
        });
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = userData;
            // Check if user already exists
            const existingUser = yield user_model_1.default.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            // Hash password
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            // Create new user
            const user = new user_model_1.default({
                username,
                email,
                password: hashedPassword,
            });
            // Save user to database
            yield user.save();
            return {
                user: user,
                message: 'User registered successfully.'
            };
        });
    }
    getProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            // Fetch a single user or apply your specific query
            const user = yield user_model_1.default.findById(id); // Modify query as needed
            if (!user) {
                throw new Error('User not found');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, environment_1.config.jwtSecret, { expiresIn: '1d' });
            const password = user.password;
            yield user.save();
            return { user,
                token,
                password
            }; // Return user wrapped in an object
        });
    }
    resetPassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Email:', email);
            console.log('New Password:', newPassword);
            // Fetch the user by email
            const user = yield user_model_1.default.findOne({ email: email }); // Modify query as needed
            if (!user) {
                throw new Error('User not found');
            }
            try {
                // Generate salt and hash password
                const salt = yield bcrypt_1.default.genSalt(10);
                console.log('Generated Salt:', salt); // Log salt value
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
                console.log('Hashed Password:', hashedPassword); // Log hashed password
                user.password = hashedPassword;
                yield user.save();
                return { user
                }; // Return user wrapped in an object
            }
            catch (err) {
                throw new Error('Error hashing password: ' + err);
            }
        });
    }
}
exports.default = new UserService();
