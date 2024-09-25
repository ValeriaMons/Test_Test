import { randomBytes } from 'crypto';
import { SHA256 } from 'crypto-js';
import { ZitadelAuth } from '@zitadel/node';
import process from 'process';

const codeVerifier = randomBytes(32).toString('base64url');
const codeChallenge = SHA256(codeVerifier).toString();

export const zitadelAuth = new ZitadelAuth({
  issuer: `https://${process.env.ZITADEL_DOMAIN}`,
  clientId: process.env.ZITADEL_CLIENT_ID!,
  redirectUri: 'http://localhost:3000/callback', // Aggiusta in base alla tua app
  scopes: ['openid', 'profile', 'email'],
});

export const getAuthUrl = () => {
  return zitadelAuth.getAuthorizationUrl({
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
};

export const getToken = async (code: string) => {
  return zitadelAuth.getTokenByCode({
    code,
    code_verifier: codeVerifier,
  });
};

export const introspectToken = async (token: string) => {
  return zitadelAuth.introspectToken(token);
};