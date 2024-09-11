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
exports.resetPassword = exports.getProfiles = exports.signin = exports.signup = void 0;
const user_service_1 = __importDefault(require("../services/user.service"));
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, } = req.body;
        const result = yield user_service_1.default.signup({
            username,
            email,
            password
        });
        res.status(201).json(result);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'User already exists') {
            return res.status(400).json({ message: error.message });
        }
        next(error);
    }
});
exports.signup = signup;
const signin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield user_service_1.default.signin(email, password);
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error && error.message === 'Invalid credentials') {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        next(error);
    }
});
exports.signin = signin;
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.userId;
        console.log(id);
        const profile = yield user_service_1.default.getProfile(id);
        res.status(200).send(profile); // Respond with the profile data
    }
    catch (error) {
        // Type assertion to check if the error is an instance of Error
        if (error instanceof Error) {
            res.status(404).send({ message: error.message }); // Handle known errors
        }
        else {
            // Handle unknown errors
            res.status(500).send({ message: 'An unexpected error occurred' });
        }
    }
});
exports.getProfiles = getProfiles;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newpassword } = req.body;
        console.log('the pass: ' + newpassword);
        const user = yield user_service_1.default.resetPassword(email, newpassword);
        console.log('before display');
        res.status(200).send(user); // Respond with the profile data
    }
    catch (error) {
        // Type assertion to check if the error is an instance of Error
        if (error instanceof Error) {
            res.status(404).send({ message: error.message }); // Handle known errors
        }
        else {
            // Handle unknown errors
            res.status(500).send({ message: 'An unexpected error occurred' });
        }
    }
});
exports.resetPassword = resetPassword;
