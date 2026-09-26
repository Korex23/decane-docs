"use client";

import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useTheme } from "@/lib/theme";

// End-user facing recovery guide. Written for the person who owns a wallet,
// not the developer integrating the SDK — plain language, no API names.
// Naming is kept in step with the wallet modal: "recovery file" (one share,
// safe anywhere) vs "full recovery file" (two shares, bearer secret).
//
// The one source for this text: there is no markdown twin. Since 2.27 the
// easy way is signing in again — for every wallet, not only where a passkey
// synced — and some apps (the identity tier) never ask for a passkey or
// password at all; that tier's plain-words security statement is here too.
interface Scenario {
  who: string;
  title: string;
  steps: string[];
}

const SCENARIOS: Scenario[] = [
  {
    who: "Everyone",
    title: "Signing in on a new device",
    steps: [
      "Sign in the way you always do: Google, email, phone, or whatever the app offers.",
      "Your wallet is back. Same addresses, same balance, nothing to remember. Signing in proves who you are; the enclave then hands your new device its own piece of the wallet.",
      "Some apps then ask you to protect the wallet on this device with a passkey (fingerprint, face or device passcode) or a password. Others never ask; see below.",
    ],
  },
  {
    who: "Some apps",
    title: "Apps that ask for nothing more",
    steps: [
      "Social apps, where a wallet is a feature rather than the point, may never ask you to set up a passkey, a password or a backup. Signing in is the whole ceremony, every visit, and nothing about your wallet is kept on your device between visits.",
      "Plainly: in those apps your wallet is exactly as safe as the account you sign in with. Anyone who can sign in as you can use your wallet. So protect that account with a strong password and two-factor authentication, as you would for your email.",
      "Two things we do for you: you get an email whenever your wallet is opened from a device you have not used before, and if it was not you, the app's support can freeze your wallet. Nothing can be sent from it, by anyone, until it is unfrozen. Signing in still works; spending does not.",
    ],
  },
  {
    who: "Optional",
    title: "Restoring from your recovery file",
    steps: [
      "You may have saved a small file when you created your wallet, or from settings later: your recovery file. It is optional. It exists so you can open your wallet even if Decane's servers are unreachable.",
      "Sign in the way you always do. If the wallet cannot be restored the easy way, you will be asked to upload the file and enter its password.",
      "Your wallet is restored. You will be given a new recovery file. Save it; the old one stops working the moment the new one exists.",
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Why is my recovery file safe to keep in a password manager?",
    a: "It holds only one of the three pieces that protect your wallet. One piece on its own cannot sign anything or move funds. It is not a smaller secret; it is no secret. That is the real difference from a seed phrase, and it is why storing it in a password manager or cloud drive is fine by design, not a risk you are accepting for convenience.",
  },
  {
    q: "Why does using my recovery file give me a new one?",
    a: "Each time a recovery file restores your wallet, it is retired and a fresh one is issued in its place. You will be prompted to save the new file right away; do that before moving on. The old one stops working the moment the new one is created.",
  },
  {
    q: "What is a full recovery file, and do I need one?",
    a: "It is an optional, more powerful backup you can create from your wallet settings. Unlike the ordinary recovery file, it contains two of the three pieces, so the file plus its password is complete control of your wallet. Keep it offline (an encrypted USB drive, or printed in a safe), never in a cloud drive. Most people never need one; it exists for anyone who wants their wallet fully recoverable entirely on their own.",
  },
  {
    q: "Someone else signed in as me. What do I do?",
    a: "Change the password of the account you sign in with right away and sign out of its other sessions; that account is the key. Then contact the app's support and ask for your wallet to be frozen while you sort it out. Unfreezing restores it exactly; nothing about the wallet moves. You will usually learn about it from the new-device email.",
  },
  {
    q: "What if I lose everything?",
    a: "If you lose the account you sign in with, and you have no recovery file and no full recovery file, your wallet cannot be recovered, not by you, not by anyone. Signing in is the key, so guard that account as you would the wallet itself. Recovering the account (through Google, your email provider or your phone number) recovers the wallet with it. If it is Decane that is unreachable, nothing is lost: the wallet waits. The recovery file is what removes that dependency.",
  },
];

export default function RecoveryGuidePage() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="site" data-theme={theme}>
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero" style={{ paddingBottom: 56 }}>
        <div className="container">
          <div className="prose">
            <h1>Recovering your wallet</h1>
            <p style={{ marginTop: 22 }}>
              Your wallet is protected by three separate pieces, and any two of them are enough to
              open it. One is issued to the device you are using. One lives with us. One is sealed
              inside our signing enclave, opened only for you, after you sign in.
            </p>
            <p>
              No single piece, on its own, can do anything with your wallet. So losing your phone
              is not a disaster: sign in again, and it is back.
            </p>
          </div>
        </div>
      </header>

      <section style={{ paddingBottom: 80 }}>
        <div className="container">
          <div className="shares">
            <div className="share">
              <h3>Your device</h3>
              <p>
                Issued to the device you are using, for that session. Some apps protect it there
                with your fingerprint, face or a password; others keep nothing on the device at all
                and simply issue a fresh one each time you sign in.
              </p>
            </div>
            <div className="share">
              <h3>Our server</h3>
              <p>
                Encrypted at rest on the Decane key server. It never holds a full key and never
                signs anything on its own.
              </p>
            </div>
            <div className="share">
              <h3>The sealed piece</h3>
              <p>
                Locked inside our signing enclave, a box only the enclave can open, and only for
                you, after you sign in. It is what lets a new device get its own piece from a
                sign-in alone. Your optional recovery file is a copy of this one, safe in a password
                manager or cloud drive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {SCENARIOS.map((s) => (
            <div key={s.title} className="scenario">
              <div>
                <span className="who">{s.who}</span>
                <h2>{s.title}</h2>
              </div>
              <ol className="steps">
                {s.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="tool">
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 12 }}>The offline recovery tool</h2>
              <p>
                If you have created a <strong>full recovery file</strong>, this standalone page turns
                it back into your wallet&rsquo;s private keys, entirely in your browser, with no
                network connection. It is a single self-contained file: save it next to your
                recovery file and it keeps working on its own, indefinitely.
              </p>
              <p>
                To use it safely: download the page, disconnect from the internet, then open the
                saved file. It never sends your file or keys anywhere.
              </p>
            </div>
            <div className="tool-actions">
              <a href="/offline-recovery.html" target="_blank" rel="noreferrer" className="btn btn-primary">
                Open the recovery tool
              </a>
              <a href="/offline-recovery.html" download="decane-offline-recovery.html" className="btn btn-secondary">
                Download for offline use
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Questions</h2>
          </div>
          <dl className="faq">
            {FAQS.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
