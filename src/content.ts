import { load, InboxSDK } from "@inboxsdk/core";

import { ComposeView } from "@inboxsdk/core/src/platform-implementation-js/driver-interfaces/driver";
import { MessageView } from "@inboxsdk/core/src/platform-implementation-js/platform-implementation";

import { debug } from "./utils/logger";
import { getSignature } from "./utils/signature";
import { calculateHash } from "./utils/hash";

debug("content script loaded");

const setupSDK = (sdk: InboxSDK) => {
  sdk.Compose.registerComposeViewHandler(addButtonComposeView);

  sdk.Conversations.registerMessageViewHandler(filterMessages);

  sdk.Lists.registerThreadRowViewHandler((threadRowView) => {
    // a thread row view has come into existence, do something with it!
    // debug("threadRowView", threadRowView);

    const threadId = threadRowView.getThreadID();

    const subject = threadRowView.getSubject();

    debug("threadRowView.getSubject()", subject);
    debug("threadRowView.getThreadID()", threadId);

    threadRowView.getThreadIDAsync;

    threadRowView.addImage({
      imageUrl:
        "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
      tooltip: "Worldcoin Email",
      imageClass: "worldcoin-email-icon",

      // onClick: () => {
      //   debug("clicked");
      // }
    });
  });
};

const filterMessages = async (messageView: MessageView) => {
  const view = await messageView.getThreadView();

  const all = await view.getMessageViewsAll();

  debug("all", all);
};

const addButtonComposeView = (composeView: ComposeView) => {
  // a compose view has come into existence, do something with it!
  composeView.addButton({
    title: "Signed w/ World ID",
    iconUrl:
      "https://em-content.zobj.net/thumbs/240/apple/354/check-mark-button_2705.png",
    // "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
    onClick(event: any) {
      const user = { email: "123@id.worldcoinemail.org" }; // get from session
      alert(
        `This message is signed with Worldcoin Email 🌎 using account ${user.email}`
      );
    },
  });

  composeView.on("presending", function (event: any) {
    debug("presending", event);

    // fetch sender, recipients, subject, body
    const metadataHTML = composeView.getMetadataForm();
    const subject = composeView.getSubject();
    const bodyHTML = composeView.getBodyElement();

    // TODO: is there an attack vector here? two different emails with the same hash due to using metadata in the body html?
    const email = metadataHTML.outerHTML + subject + bodyHTML.outerHTML;

    const hash = calculateHash(email);

    const signature = getSignature(hash);

    debug("signature", signature);

    composeView.setBodyHTML(bodyHTML.outerHTML + signature);
    // event.fullEmailText = fullEmailText + signature;
  });

  composeView.on("destroy", function (event: any) {
    console.log("compose view going away, time to clean up");
  });
};

load(2, "sdk_worldcoin-email_3a1158d205", {}).then(setupSDK);
