# Recovering your wallet

Your wallet is protected by three separate things, and any two of them are enough to open it. One lives on your phone. One lives with Decane. One is yours to keep — a small file you can save wherever's convenient. No single one of these, on its own, can do anything with your wallet.

That's the whole idea: losing your phone isn't a disaster, because your Decane piece plus a device passkey can restore it. Decane disappearing isn't a disaster either, because your piece plus your phone's piece still works. And the file you keep as backup is genuinely safe to store somewhere ordinary — a lone piece reveals nothing, so there's nothing for it to leak.

For almost everyone, none of this is visible day to day. Here's what to expect when it matters.

## The easy way: signing in on a new device

If you get a new phone, reinstall your browser, or just open the app somewhere you haven't before:

1. Sign in the same way you always do (Google or email).
2. When prompted, use your fingerprint, face, or device passcode — the same "passkey" prompt you already use to unlock apps and log into websites.
3. Your wallet is back. Same addresses, same balance, nothing to remember.

This works because your phone or computer's password manager (iCloud Keychain, Google Password Manager, 1Password, etc.) automatically carries your passkey to your new device — the same way your saved website passwords show up on a new phone. You don't need to do anything special to make this happen; if you already use one of these password managers, it's already set up.

**This is the path almost everyone will use.** You may not even notice a "recovery" happened — it just looks like signing in.

## The backup: your recovery share file

Sometimes the easy way doesn't work — you switched to a phone that doesn't share a password manager with your old one, or you're not using a password manager at all. For that situation, you may have saved a small file when you first created your wallet: your **recovery share**.

If you saved it, here's how it's used:

1. Sign in the same way you always do (Google or email).
2. If your device can't find a synced passkey, you'll be asked to upload your recovery share file and enter its password.
3. Your wallet is restored, and a new passkey is set up on this device automatically — so next time, you're back to the easy way.

### Why this file is safe to keep somewhere convenient

This is a real, meaningful difference from a seed phrase, and it's worth understanding: **the file you save contains only one of the three pieces protecting your wallet.** One piece, on its own, can't sign anything, can't move funds, can't do anything at all — it's not a smaller secret, it's no secret. This is what makes it genuinely fine to keep in a password manager's secure storage or a cloud drive. It isn't a shortcut or a risk you're accepting for convenience; the file is designed from the start to be safe there.

### Using it gives you a new file — save that one too

Every time your recovery share is used to restore your wallet, it's automatically retired and a fresh one is issued in its place. You'll be prompted to save the new file immediately — do that before moving on. The old file stops working the moment the new one is created, so holding onto it afterward serves no purpose.

## The portable backup (advanced, optional)

There's a second, separate kind of file you can create from your account settings: a **portable backup**. Most people will never need this — it exists for one specific situation: wanting your wallet to remain fully recoverable even if Decane, as a company, is no longer around.

This file is different in an important way, and the storage advice for it is the *opposite* of the recovery share above:

- It contains **two** of the three pieces, not one — enough on its own, together with its password, to fully control your wallet.
- Store it offline: an encrypted USB drive, or printed and kept in a safe. **Do not** put it in a cloud drive or password manager.
- Creating one retires your current recovery share too (the same rotation described above) — you'll be prompted to save a fresh recovery share alongside it.
- Only create one if you specifically want the "works even without Decane" guarantee. It's an advanced option, not a routine backup step.

## If you lose everything

If you lose access to your device **and** your recovery share (or portable backup), your wallet cannot be recovered — not by you, not by Decane, not by anyone. There's no "reset password" option. That's a deliberate consequence of how your wallet is kept secure, not an oversight: it's exactly what "nobody but you controls this wallet" means in practice.

This is why saving a recovery share is worth the one-time minute it takes, even though most people will never need it.

## Quick reference

| Situation | What happens |
|---|---|
| New device, password manager syncs your passkey | Sign in, use fingerprint/face — wallet is back automatically |
| New device, no synced passkey, recovery share saved | Sign in, upload your recovery share file and enter its password — wallet is restored, new passkey set up, save the new recovery share you're given |
| No recovery share saved, but still have a device with a working passkey | You're fine — go to settings and generate one as a backup any time |
| Want your wallet recoverable even without Decane | Create a portable backup from settings — store it offline, not in the cloud |
| Lost your device **and** your recovery share/portable backup | Wallet cannot be recovered by anyone, including Decane |
