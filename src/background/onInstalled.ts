// @ts-ignore
chrome.runtime.onInstalled.addListener(async () => {
  // @ts-ignore
  const { token } = await chrome.storage.local.get(["token"]);

  if (token) {
    // all good logged in
  } else {
    // open https://worldcoinemail.org/auth
    // wait for token
    // save token
    // @ts-ignore
    chrome.tabs.create({ url: "https://worldcoinemail.org/auth" });
  }
});
