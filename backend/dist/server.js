"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const user_1 = __importDefault(require("./models/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Initialize User model
(0, user_1.default)(database_1.default);
// Routes
app.use('/users', userRoutes_1.default);
// Sync database and start server
database_1.default.sync().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.error('Unable to connect to the database:', err));
