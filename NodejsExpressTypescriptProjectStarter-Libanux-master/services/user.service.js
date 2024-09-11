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
            const { email, password } = userData;
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
}
exports.default = new UserService();
