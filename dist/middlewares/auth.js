"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment"); // Ensure this path is correct
const authMiddleware = (req, res, next) => {
    var _a;
    // Use 'authorization' in lowercase as it appears in headers
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        // Decode token
        const decoded = jsonwebtoken_1.default.verify(token, environment_1.config.jwtSecret);
        req.userId = decoded.userId; // Ensure Request interface is extended
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
exports.authMiddleware = authMiddleware;
