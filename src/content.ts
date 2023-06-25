import { load, InboxSDK } from "@inboxsdk/core";
import { ComposeView } from "@inboxsdk/core/src/platform-implementation-js/driver-interfaces/driver";
import { MessageView } from "@inboxsdk/core/src/platform-implementation-js/platform-implementation";
// import { GmailMessageView } from '@inboxsdk/core'
// import GmailMessageView from "@inboxsdk/core/src/platform-implementation-js/dom-driver/gmail/views/gmail-message-view";

const setupSDK = (sdk: InboxSDK) => {
  sdk.Compose.registerComposeViewHandler(addButtonComposeView);

  sdk.Conversations.registerMessageViewHandler(filterMessages);
};

const filterMessages = async (messageView: MessageView) => {
  const view = await messageView.getThreadView();

  const all = await view.getMessageViewsAll();

  console.log("all", all);
};

const addButtonComposeView = (composeView: ComposeView) => {
  const signature = `
    ✅ Verified w/ Worldcoin Email:
    https://worldcoinemail.org/verify/$hash
  `;
  // a compose view has come into existence, do something with it!
  composeView.addButton({
    title: "Sign with World ID",
    iconUrl:
      "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
    onClick(event: any) {
      event.composeView.insertTextIntoBodyAtCursor("Hi typescript1");
    },
  });
};

load(2, "sdk_worldcoin-email_3a1158d205", {}).then(setupSDK);
