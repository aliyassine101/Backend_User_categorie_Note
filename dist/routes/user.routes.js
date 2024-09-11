"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routesConstants_1 = require("../constants/routesConstants");
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post(routesConstants_1.ROUTES.SIGNIN, user_controller_1.signin);
router.post(routesConstants_1.ROUTES.SIGNUP, user_controller_1.signup);
router.post('/GET_PROFILE_BY_ID_USER', auth_1.authMiddleware, user_controller_1.getProfiles);
router.post('/RESET_PASSWORD_USER', user_controller_1.resetPassword);
exports.default = router;
