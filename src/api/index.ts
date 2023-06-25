import { debug } from "../utils/logger";

const API_URL = "https://worldcoinemail.org/api";
// const API_URL = "http://localhost:3000/api";

// ## API Reference

// ### Unauthorized

// - GET `/api/user/:sub` returns json with user reputation for a specific user id
// - POST `/api/auth` standard OAuth flow, saves user into db or logs in after successful auth

// ### Authorized only

// - GET `/api/email/:hash/verify` returns whether this hash is in the DB and whether specific user did send it
// - POST `/api/email/:hash/:nonce/send` creates Email, only email hash and nonce is required
// - ? PUT `/api/email/:hash/report` adds ReputationStrike (from specific user, to user)

// export const setAuth = async (token: string) => {
//   chrome.storage.local.get({ token })

// };

export const getAuthHeaders = async () => {
  // @ts-ignore
  const { token } = await chrome.storage.local.get(["token"]);

  debug("token", token);

  if (!token) {
    // open https://worldcoinemail.org/auth
    // wait for token
    // save token
    // @ts-ignore
    chrome.tabs.create({ url: "https://worldcoinemail.org/auth" });

    throw new Error("No token found");
  }

  return {
    "X-Fake-Header": `Bearer ${token}`,
  };
};

export const verify = async (hash: string) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/verify-email/${hash}`, {
    headers,
  });

  return await response.json();
};

export const send = async (hash: string) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/send-email/${hash}`, {
    headers,
  });

  return await response.json();
};
