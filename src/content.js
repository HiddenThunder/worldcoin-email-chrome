import * as InboxSDK from '@inboxsdk/core';
// import { GmailMessageView } from '@inboxsdk/core'
// import GmailMessageView from "@inboxsdk/core/src/platform-implementation-js/dom-driver/gmail/views/gmail-message-view";

const setupSDK = (sdk) => {
  sdk.Compose.registerComposeViewHandler(addButtonComposeView);

  sdk.Conversations.registerMessageViewHandler(filterMessages)
}

const filterMessages = async (messageView) => {
  const view = await messageView.getThreadView();

  const all = await view.getMessageViewsAll();

  const messages = await Promise.all(
    all.map(async (message) => {
      message.actions.forEach((action) => {
        console.log("[WORLDCOIN EMAIL]", "action", action);
      });
    })
  );
};

const addButtonComposeView = (composeView) => {
  const signature = `
    ✅ Verified w/ Worldcoin Email:
    https://worldcoinemail.org/verify/$hash
  `;
  // a compose view has come into existence, do something with it!
  composeView.addButton({
    title: "Sign with World ID",
    iconUrl:
      "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
    onClick(event) {
      event.composeView.insertTextIntoBodyAtCursor("Hello World!");
    },
  });
};

InboxSDK.load(2, "sdk_worldcoin-email_3a1158d205").then(setupSDK);
