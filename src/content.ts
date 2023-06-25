import "./capture-token";

import { load, InboxSDK } from "@inboxsdk/core";

import { MessageView, ComposeView, Contact } from "@inboxsdk/core/src/inboxsdk";

import { send, verify } from "./api/index";

import { debug } from "./utils/logger";
import { getSignature } from "./utils/signature";
import { calculateHash } from "./utils/hash";

debug("content script loaded");

const toString = (contact: Contact) => {
  return `${contact.name} <${contact.emailAddress}>`;
};

const setupSDK = (sdk: InboxSDK) => {
  sdk.Compose.registerComposeViewHandler(addButtonComposeView);

  sdk.Conversations.registerMessageViewHandler(verifyMessage);

  sdk.Lists.registerThreadRowViewHandler((threadRowView) => {
    // a thread row view has come into existence, do something with it!
    // debug("threadRowView", threadRowView);

    const threadId = threadRowView.getThreadID();

    const subject = threadRowView.getSubject();

    debug("threadRowView.getSubject()", subject);
    debug("threadRowView.getThreadID()", threadId);

    threadRowView.getThreadIDAsync;
    const crossmarkUrl =
      "https://em-content.zobj.net/thumbs/240/apple/354/cross-mark_274c.png";
    const checkmarkUrl =
      "https://em-content.zobj.net/thumbs/240/apple/354/check-mark-button_2705.png";
    const greyCheckmarkUrl =
      "https://em-content.zobj.net/thumbs/240/apple/354/check-box-with-check_2611-fe0f.png";

    threadRowView.addImage({
      imageUrl: Math.random() > 0.3 ? crossmarkUrl : checkmarkUrl,
      tooltip: "Worldcoin Email",
      imageClass: "worldcoin-email-icon",
    });
  });
};

const verifyMessage = async (messageView: MessageView) => {
  debug("messageView", messageView);

  (window as any).messageView = messageView;

  const sender = messageView.getSender();
  const recipients = await messageView.getRecipientsFull();
  // const subject = messageView
  const bodyHTML = messageView.getBodyElement();

  debug("metadataHTML", { sender, recipients, bodyHTML });

  // TODO: is there an attack vector here? two different emails with the same hash due to using metadata in the body html?
  const email = recipients.map(toString).join(";") + toString(sender); //  + bodyHTML.outerHTML;

  debug("[email]", email);

  const hash = calculateHash(email);

  debug("hash", hash);

  const { isRealHuman, rep } = await verify(hash);

  debug("isValid", isRealHuman, rep);

  bodyHTML.innerHTML =
    `
    ${
      isRealHuman
        ? `This message is written by a real human being 💌`
        : `This message is not verified and probably written by a robot 🤖`
    }
    <br />
    ${isRealHuman ? "✅✅✅" : "❌❌❌"}
    <br />
    -----------------------------------------------
    <br />
  ` + bodyHTML.innerHTML;
};

const addButtonComposeView = (composeView: ComposeView) => {
  // a compose view has come into existence, do something with it!
  composeView.addButton({
    title: "Signed w/ World ID",
    iconUrl:
      // love letter
      "https://em-content.zobj.net/thumbs/240/apple/354/love-letter_1f48c.png",
    // check mark
    // "https://em-content.zobj.net/thumbs/240/apple/354/check-mark-button_2705.png",
    onClick(event: any) {
      alert(
        `This message is signed with Worldcoin Email 💌 using your account`
      );
    },
  });

  composeView.on("presending", function (event: any) {
    debug("presending", event);

    // fetch sender, recipients, subject, body
    const recipients = composeView.getToRecipients();
    const sender = composeView.getFromContact();
    const bodyHTML = composeView.getBodyElement();

    // TODO: is there an attack vector here? two different emails with the same hash due to using metadata in the body html?
    const email = recipients.map(toString).join(";") + toString(sender); // + bodyHTML.outerHTML;

    debug("[email]", email);

    const hash = calculateHash(email);

    debug("hash", hash);
    const signature = getSignature(hash);

    debug("signature", signature);

    composeView.setBodyHTML(bodyHTML.outerHTML + signature);

    // TODO: send into api and check response, if it fails, throw error and stop sending

    (async () => {
      try {
        const isSuccess = await send(hash);

        if (!isSuccess) {
          throw new Error("Email not sent");
        }
      } catch (error) {
        debug("error", error);

        // TODO: event.cancel();
      }
    })();
  });

  composeView.on("destroy", function (event: any) {
    debug("compose view going away, time to clean up");
  });
};

load(2, "sdk_worldcoin-email_3a1158d205", {}).then(setupSDK);
