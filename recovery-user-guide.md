# Recovering your wallet

Your wallet is protected by two independent things working together: your device (through your fingerprint, face, or a PIN) and Decane's servers. Neither one alone can access your wallet — that's what keeps it safe. But it also means that if you get a new phone or computer, your wallet needs to reconnect the two pieces. That process is called **recovery**.

For almost everyone, recovery is invisible. Here's what to expect.

## The easy way: signing in on a new device

If you get a new phone, reinstall your browser, or just open the app somewhere you haven't before:

1. Sign in the same way you always do (Google or email).
2. When prompted, use your fingerprint, face, or device passcode — the same "passkey" prompt you already use to unlock apps and log into websites.
3. Your wallet is back. Same addresses, same balance, nothing to remember.

This works because your phone or computer's password manager (iCloud Keychain, Google Password Manager, 1Password, etc.) automatically carries your passkey to your new device — the same way your saved website passwords show up on a new phone. You don't need to do anything special to make this happen; if you already use one of these password managers, it's already set up.

**This is the path almost everyone will use.** You may not even notice a "recovery" happened — it just looks like signing in.

## The backup: your 24-word recovery phrase

Sometimes the easy way doesn't work — you switched to a phone that doesn't share a password manager with your old one, or you're not using a password manager at all. For that situation, you were given a **24-word recovery phrase** when you first created your wallet.

If you saved it, here's how it's used:

1. Sign in the same way you always do (Google or email).
2. If your device can't find a passkey, you'll be asked to enter your 24-word phrase instead.
3. Type the words in order, exactly as you wrote them down.
4. Your wallet is restored, and a new passkey is set up on this device automatically — so next time, you're back to the easy way.

### Important: your phrase alone cannot be used to steal your wallet

Unlike the recovery phrases used by most other crypto wallets, this one is intentionally incomplete on its own. It only works together with your Decane account — someone would need both your recovery phrase *and* access to your signed-in account to do anything with it. Still, treat it as sensitive: don't share it with anyone, and don't post it anywhere.

## Where to keep your recovery phrase

Write it down somewhere physical — paper, a notebook, a safe. Store it somewhere you'd store a spare house key or a passport, not somewhere digital.

**Do not** save it in Google Drive, iCloud Drive, Notes apps that sync to the cloud, or email it to yourself. This isn't just general caution — it specifically defeats the purpose of having two separate recovery methods. Your passkey sync *already* depends on your Google or Apple account. If your recovery phrase lives in that same account, then losing access to that one account now costs you both of your recovery methods at once, instead of just one.

## If you lose both

If you lose access to a device with your passkey on it **and** you've lost your recovery phrase, your wallet cannot be recovered. Not by Decane, not by support, not by anyone. There is no "reset password" option — that's a deliberate consequence of how your wallet is kept secure, not an oversight. Nobody, including us, holds enough information on their own to restore it for you.

This is why we recommend saving your recovery phrase even though most people will never need it. It costs you a few minutes once, and it's the only thing standing between "annoying" and "unrecoverable" if your only device is ever lost, stolen, or broken.

## Quick reference

| Situation | What happens |
|---|---|
| New device, password manager syncs your passkey | Sign in, use fingerprint/face — wallet is back automatically |
| New device, no synced passkey | Sign in, enter your 24-word phrase — wallet is restored, new passkey set up |
| Lost your phrase, but still have a device with a working passkey | You're fine — go to settings and generate a new phrase as a fresh backup |
| Lost both your passkey-holding device and your phrase | Wallet cannot be recovered by anyone, including Decane |
