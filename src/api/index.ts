const API_URL = "https://worldcoinemail.org/api";

// ## API Reference

// ### Unauthorized

// - GET `/api/user/:sub` returns json with user reputation for a specific user id
// - POST `/api/auth` standard OAuth flow, saves user into db or logs in after successful auth

// ### Authorized only

// - GET `/api/email/:hash/verify` returns whether this hash is in the DB and whether specific user did send it
// - POST `/api/email/:hash/:nonce/send` creates Email, only email hash and nonce is required
// - ? PUT `/api/email/:hash/report` adds ReputationStrike (from specific user, to user)

export const verify = async (hash: string) => {
  const response = await fetch(`${API_URL}/email/${hash}/verify`);
  return await response.json();
};

export const send = async (hash: string) => {
  const response = await fetch(`${API_URL}/email/${hash}/send`);
  return await response.json();
};
