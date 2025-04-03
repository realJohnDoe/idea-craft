import jwt from 'jsonwebtoken';
import fs from 'fs';
import fetch from 'node-fetch';

const appId = process.env.GITHUB_APP_ID;
const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// Define an interface for the expected response
interface InstallationAccessTokenResponse {
  token: string;
  expires_at: string;
  permissions: {
    [key: string]: string;
  };
  repository_selection: string;
}

export async function getInstallationAccessToken(code: string): Promise<string> {
  // 1. Exchange the authorization code for an access token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${window.location.origin}/github-callback`,
    }),
  });

  const tokenData = await tokenResponse.json();

  // 2. Create JWT
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + (10 * 60), // 10 minutes
    iss: appId,
  };
  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  // 3. Get Installations
  const installationsResponse = await fetch(`https://api.github.com/app/installations`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const installations = await installationsResponse.json();
  const installationId = installations[0].id; // Get the first installation ID

  // 4. Create Installation Access Token
  const accessTokenResponse = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  const data = (await accessTokenResponse.json()) as InstallationAccessTokenResponse; // Type assertion with interface
  return data.token;
}
