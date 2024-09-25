import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function getZitadelAccessToken(): Promise<string> {
  const response = await axios.post(
    `https://${process.env.ZITADEL_DOMAIN}/oauth/v2/token`,
    new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'openid profile email urn:zitadel:iam:org:project:id:zitadel:aud',
    }),
    {
      auth: {
        username: process.env.ZITADEL_CLIENT_ID!,
        password: process.env.ZITADEL_CLIENT_SECRET!,
      },
    }
  );
  return response.data.access_token;
}

export async function createZitadelUser(user: any, accessToken: string): Promise<string> {
  const response = await axios.post(
    `https://${process.env.ZITADEL_DOMAIN}/management/v1/users/human`,
    {
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
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data.userId;
}

export async function assignZitadelRole(userId: string, role: string, accessToken: string): Promise<void> {
  await axios.post(
    `https://${process.env.ZITADEL_DOMAIN}/management/v1/users/${userId}/grants`,
    {
      roleKeys: [role],
      projectId: process.env.ZITADEL_PROJECT_ID,
    },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}