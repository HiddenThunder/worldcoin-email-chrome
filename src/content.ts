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

    threadRowView.addImage({
      imageUrl:
        "https://em-content.zobj.net/thumbs/240/apple/354/check-box-with-check_2611-fe0f.png",
      // "https://em-content.zobj.net/thumbs/240/apple/354/check-box-with-check_2611-fe0f.png",
      // "https://lh5.googleusercontent.com/itq66nh65lfCick8cJ-OPuqZ8OUDTIxjCc25dkc4WUT1JG8XG3z6-eboCu63_uDXSqMnLRdlvQ=s128-h128-e365",
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
    This message was scanned by Worldcoin Email 🌎:
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
