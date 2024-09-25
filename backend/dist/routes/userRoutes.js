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
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const zitadelService_1 = require("../services/zitadelService");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.User.findAll();
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield user_1.User.create(req.body);
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: 'Bad request' });
    }
}));
router.post('/sync', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield (0, zitadelService_1.getZitadelAccessToken)();
        const users = yield user_1.User.findAll();
        for (const user of users) {
            try {
                const zitadelUserId = yield (0, zitadelService_1.createZitadelUser)(user, accessToken);
                yield (0, zitadelService_1.assignZitadelRole)(zitadelUserId, user.role, accessToken);
                console.log(`User ${user.username} synced successfully`);
            }
            catch (error) {
                console.error(`Error syncing user ${user.username}:`, error);
            }
        }
        res.json({ message: 'Users sync process completed' });
    }
    catch (error) {
        console.error('Error in sync process:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
router.post('/sync/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const accessToken = yield (0, zitadelService_1.getZitadelAccessToken)();
        const zitadelUserId = yield (0, zitadelService_1.createZitadelUser)(user, accessToken);
        yield (0, zitadelService_1.assignZitadelRole)(zitadelUserId, user.role, accessToken);
        res.json({ message: `User ${user.username} synced successfully` });
    }
    catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
exports.default = router;
