"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./config/environment");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const categorie_route_1 = __importDefault(require("./routes/categorie.route"));
const note_route_1 = __importDefault(require("./routes/note.route"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
mongoose_1.default.connect(environment_1.config.mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Routes
app.use('/auth', user_routes_1.default);
app.use('/categorie', categorie_route_1.default);
app.use('/note', note_route_1.default);
exports.default = app;
