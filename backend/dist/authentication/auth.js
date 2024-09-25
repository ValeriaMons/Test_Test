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
exports.introspectToken = exports.getToken = exports.getAuthUrl = void 0;
const crypto_1 = require("crypto");
const crypto_js_1 = require("crypto-js");
const node_1 = require("@zitadel/node");
const process_1 = __importDefault(require("process"));
const codeVerifier = (0, crypto_1.randomBytes)(32).toString('base64url');
const codeChallenge = (0, crypto_js_1.SHA256)(codeVerifier).toString();
const zitadelAuth = (0, node_1.getZitadelAuth)({
    issuer: `https://${process_1.default.env.ZITADEL_DOMAIN}`,
    clientId: process_1.default.env.ZITADEL_CLIENT_ID,
    redirectUri: 'http://localhost:3000/callback', // Aggiusta in base alla tua app
    scopes: ['openid', 'profile', 'email'],
});
const getAuthUrl = () => {
    return zitadelAuth.getAuthorizationUrl({
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    });
};
exports.getAuthUrl = getAuthUrl;
const getToken = (code) => __awaiter(void 0, void 0, void 0, function* () {
    return zitadelAuth.getTokenByCode({
        code,
        code_verifier: codeVerifier,
    });
});
exports.getToken = getToken;
const introspectToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return zitadelAuth.introspectToken(token);
});
exports.introspectToken = introspectToken;
