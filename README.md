# Worldcoin Email extension

## Motivation

Spam in email. Allow people to verify that message was sent by a real person, and attach a reputation to that person

Non-users benefit from the same feature, seeing signature + verification link in the footer + reputation score for that sender at that link

## Architecture

- Chrome extension
    - Adds “Sign message” to Compose view at Gmail
    - Adds “Verified” checkmark in List view in your Inbox
    - Creates a folder out of verified messages
- Frontend
    - Sign in w/ World ID page
    - Verify Email
    - Downvote/Unsubscribe/Report/Block page
- Backend
    - Sign in and Sign up, save user info to db
    - Send Email, save nonce + email hash for each user
    - Verify Email, by hash return whether the email was indeed sent by given sub (user id)
    - ? Report/Unsubscribe, add downvote/block FROM user TO user, only allowed from signed in users
    - ? Report, open endpoint, anyone can add downvote for a specific user id, but this data is not incorporated directly into blocking system

## API Reference

### Unauthorized

- GET `/api/user/:sub` returns json with user reputation for a specific user id
- POST `/api/auth` standard OAuth flow, saves user into db or logs in after successful auth

### Authorized only

- GET `/api/email/:hash/verify` returns whether this hash is in the DB and whether specific user did send it
- POST `/api/email/:hash/:nonce/send` creates Email, only email hash and nonce is required
- ? PUT `/api/email/:hash/report` adds ReputationStrike (from specific user, to user)

## Instructions

1. Run `npm install` to install dependencies.
2. Run `npm start` to start the development server or `npm run build`. You can also download and unpack zip manually
3. In Chrome, go to `chrome://extensions`, turn on Developer mode, click "Load unpacked", and pick the "dist" directory within this project.
4. Open https://mail.google.com/ and click "Compose an email" at the top left.
5. There's a button added to the Compose view!
6. Open `content.js` to see the code responsible for this.

You can make changes to content.ts and the extension will automatically be rebuilt as long as the `npm start` command is still running. If you make any changes, then to apply them you will have to press the ⟳ Reload extension button and then refresh Gmail.

You can run `npm run build` to create an optimized production build of your extension in the "dist" directory.
