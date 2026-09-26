# Recovering your wallet

Your wallet is protected by three separate pieces, and any two of them are enough to open it. One is issued to the device you are using. One lives with Decane. One is sealed inside Decane's signing enclave — a locked box that only the enclave can open, and only for you, after you sign in. No single piece, on its own, can do anything with your wallet.

That is the whole idea. Losing your phone isn't a disaster: sign in again and the enclave issues your new device its own piece. Decane disappearing isn't a disaster either, if you keep the optional backup described below. And nothing you are asked to keep is ever a secret on its own.

For almost everyone, none of this is visible day to day. Here is what to expect when it matters.

## The easy way: signing in again

If you get a new phone, reinstall your browser, clear your data, or open the app somewhere you haven't before:

1. Sign in the same way you always do (Google, email, phone, or whatever the app offers).
2. Your wallet is back. Same addresses, same balance, nothing to remember.

That is it. Signing in proves who you are; the enclave then hands your new device its own piece of the wallet. There is no code to keep, no file to find, no question to answer.

**This is the path almost everyone will use.** You will not notice a "recovery" happened — it just looks like signing in.

## Apps that ask for nothing more

Some apps — typically social apps, where a wallet is a feature rather than the point — never ask you to set up a passkey, a password, or a backup. Signing in is the whole ceremony, every time. Nothing about your wallet is stored on your device between visits.

This is a deliberate choice by the app, and it is worth understanding what it means, plainly:

> In these apps, your wallet is exactly as safe as the account you sign in with. Anyone who can sign in as you can use your wallet. There is no second thing they would also need.

So the account you sign in with is the thing to protect. Use a strong password and two-factor authentication on it, the same as you would for your email. Two things Decane does on your behalf:

- **You get an email whenever your wallet is opened from a device you haven't used before.** If it wasn't you, change that account's password immediately, sign out of its other sessions, and contact the app's support so your wallet can be frozen while you sort it out.
- **Your wallet can be frozen.** While frozen, nothing can be signed or sent from it, by anyone — you included — until it is unfrozen. Signing in still works; spending does not.

## Apps that add a passkey or password on this device

Other apps — typically ones where you hold real value — ask you, once per device, to protect the wallet there with a passkey (your fingerprint, face, or device passcode) or a password. That protection wraps the piece kept on that device, so a stolen or shared device is not enough on its own.

On a new device, the easy way above still applies: sign in, and the app may then ask you to set up the passkey or password there too. Where your password manager syncs passkeys between your devices (iCloud Keychain, Google Password Manager, 1Password, and so on), you may not even be asked.

An app may also ask for your fingerprint or face **for every transaction** rather than once per session. That is the app's choice; it protects that app's sessions.

## The backup: your recovery share file

You may have saved a small file when you first created your wallet, or generated one later from settings: your **recovery share**. It is optional. It exists for one situation — wanting to be able to open your wallet even if Decane's servers are unreachable — and for most people the easy way makes it unnecessary.

If you saved it and ever need it:

1. Sign in the same way you always do.
2. If the wallet cannot be restored the easy way, you will be asked to upload your recovery share file and enter its password.
3. Your wallet is restored.

### Why this file is safe to keep somewhere convenient

This is a real, meaningful difference from a seed phrase, and it is worth understanding: **the file contains only one of the three pieces protecting your wallet.** One piece, on its own, can't sign anything, can't move funds, can't do anything at all — it's not a smaller secret, it's no secret. This is what makes it genuinely fine to keep in a password manager's secure storage or a cloud drive.

### Using it gives you a new file — save that one too

Every time your recovery share is used to restore your wallet, it is retired and a fresh one is issued in its place. You'll be prompted to save the new file immediately — do that before moving on. The old file stops working the moment the new one exists.

## The portable backup (advanced, optional)

There is a second, separate kind of file you can create from your account settings: a **portable backup**. Most people will never need this — it exists for one specific situation: wanting your wallet to remain fully recoverable even if Decane, as a company, is no longer around.

This file is different in an important way, and the storage advice for it is the *opposite* of the recovery share above:

- It contains **two** of the three pieces, not one — enough on its own, together with its password, to fully control your wallet.
- Store it offline: an encrypted USB drive, or printed and kept in a safe. **Do not** put it in a cloud drive or password manager.
- Creating one retires your current recovery share too — you'll be prompted to save a fresh recovery share alongside it.
- Only create one if you specifically want the "works even without Decane" guarantee.

## If you lose everything

**If you lose the account you sign in with** — and you have no recovery share and no portable backup — your wallet cannot be recovered. Not by you, not by Decane, not by anyone. Signing in *is* the key, so guard that account as you would the wallet itself. Recovering the account (through Google, your email provider, or your phone number) recovers the wallet with it.

**If Decane is unreachable** and you have neither file, your wallet waits until it is reachable again; nothing is lost, but nothing can be signed in the meantime. The recovery share is what removes that dependency; the portable backup removes it permanently.

## Quick reference

| Situation | What happens |
|---|---|
| New device, any app | Sign in — wallet is back automatically |
| App that asks for nothing (identity tier) | Sign in, every visit. Protect the account you sign in with; watch for the new-device email |
| App that asked for a passkey or password on this device | Sign in; on a new device you may be asked to set that up there too |
| Someone else signed in as you | Change that account's password, sign out its other sessions, ask the app's support to freeze the wallet |
| Want to open the wallet even if Decane is unreachable | Keep a recovery share (safe in a password manager or cloud drive) |
| Want your wallet recoverable even without Decane | Create a portable backup from settings — store it offline |
| Lost the sign-in account **and** have no recovery share or portable backup | Wallet cannot be recovered by anyone, including Decane |
