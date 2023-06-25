import { debug } from "./utils/logger";

// we are at https://wordlcoinemail.org/auth
// we can grab access token from session and save into local storage

debug("capture-token.ts");

if (window.location.pathname !== "/auth") {
  debug("Not on auth page, skipping");
} else {
  debug("On auth page, capturing token");

  const nextData = (window as any).__NEXT_DATA__;

  const parsed = JSON.parse(nextData.innerHTML);

  debug("nextData", parsed);

  // TODO: save user as well
  const token = parsed?.props?.pageProps?.token?.access_token;

  debug("token", token);

  if (token) {
    debug("Sending token to background script");

    // @ts-ignore
    chrome.storage.local.set({ token }, () => {
      debug("Token saved", token);
    });
  } else {
    debug("No token found");
  }
}
