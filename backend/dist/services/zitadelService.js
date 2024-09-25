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
exports.getZitadelAccessToken = getZitadelAccessToken;
exports.createZitadelUser = createZitadelUser;
exports.assignZitadelRole = assignZitadelRole;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getZitadelAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`https://${process.env.ZITADEL_DOMAIN}/oauth/v2/token`, new URLSearchParams({
            grant_type: 'client_credentials',
            scope: 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud',
        }), {
            auth: {
                username: process.env.ZITADEL_CLIENT_ID,
                password: process.env.ZITADEL_CLIENT_SECRET,
            },
        });
        return response.data.access_token;
    });
}
function createZitadelUser(user, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`https://${process.env.ZITADEL_DOMAIN}/management/v1/users/human`, {
            userName: user.username,
            profile: {
                firstName: user.first_name,
                lastName: user.last_name,
            },
            email: {
                email: user.email,
                isEmailVerified: true,
            },
            password: user.password,
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data.userId;
    });
}
function assignZitadelRole(userId, role, accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        yield axios_1.default.post(`https://${process.env.ZITADEL_DOMAIN}/management/v1/users/${userId}/grants`, {
            roleKeys: [role],
            projectId: process.env.ZITADEL_PROJECT_ID,
        }, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    });
}
