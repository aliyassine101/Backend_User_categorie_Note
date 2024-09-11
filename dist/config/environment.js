"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/SocialApp',
    jwtSecret: process.env.JWT_SECRET || 'd8fb2d8d434324f51ba94d906565b0f90af127cdcc42975732494dd95c0437bf5e5637b31e9355da0b0258c9114b8861184d76137a3506e61345719ca56655d',
};
