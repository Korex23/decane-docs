"use client";

import { LegalPage, type LegalSection } from "@/components/Legal";

// Draft policy. What is collected and what is never held follows the
// backend and enclave as they are today; have counsel review before publishing.
const SECTIONS: LegalSection[] = [
  {
    id: "scope",
    title: "What this covers",
    body: (
      <>
        <p>
          This policy covers kit.decane.app, dashboard.decane.app, the Decane
          API and the signing enclave. Applications built on Decane have their
          own privacy policies for what they collect; we only see what is needed
          to run a wallet.
        </p>
        <p>
          Two kinds of people are covered: developers who hold a dashboard
          account, and end users who sign in to a Decane-powered application and
          receive a wallet.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect from end users",
    body: (
      <>
        <ul>
          <li>
            <b>A sign-in identifier.</b> When someone signs in with Google, X,
            KingsChat, email, phone or a custom login, we receive the identifier
            the provider gives us (a subject id, an email address or a phone
            number). We keep a keyed hash of it and a masked form for display,
            so that the same person signing in twice resolves to one wallet. We
            use the address or number itself to send one-time codes.
          </li>
          <li>
            <b>Wallet addresses.</b> The public addresses of the wallet on each
            chain.
          </li>
          <li>
            <b>Key shares.</b> One encrypted share of the wallet key, and the
            sealed recovery share that only the enclave can open. Neither is the
            key, and neither can sign alone.
          </li>
          <li>
            <b>Device description.</b> A stripped-down user agent for each
            device that opens the wallet, used only to email the user when an
            unseen device signs in.
          </li>
          <li>
            <b>Transactions the app records.</b> If the application chooses to
            record transaction history with us, the transaction hashes and
            amounts it sends.
          </li>
          <li>
            <b>Per-user preferences.</b> Settings the application stores for the
            user through our API.
          </li>
          <li>
            <b>Logs.</b> Request logs with IP address, time and outcome, kept
            briefly for security and debugging.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "never",
    title: "What we never hold",
    body: (
      <>
        <ul>
          <li>
            <b>A complete private key.</b> The key exists only inside an
            attested enclave for the moment it signs, and never on our servers,
            in a browser or on a phone.
          </li>
          <li>
            <b>Profile details.</b> The name and picture a provider returns at
            sign-in are passed to the application and not stored by us.
          </li>
          <li>
            <b>Passwords and passkeys.</b> A device-tier password wraps a share
            on the device; the passkey is verified by the device. We store
            neither.
          </li>
          <li>
            <b>Tracking data.</b> This site has no analytics and sets no
            tracking cookies.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "developers",
    title: "What we collect from developers",
    body: (
      <>
        <p>
          Your email address and password hash for the dashboard, your projects
          and API keys, your allow-listed origins, usage counts per project, and
          billing details handled by our payment provider. We use your email for
          operational notices such as plan-limit warnings, security notices and
          changes to these terms.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use it",
    body: (
      <>
        <p>
          To create and open wallets, sign transactions the user asks for, send
          one-time codes, detect and notify sign-ins from new devices, apply
          rate limits, freeze a wallet on request, bill developers, and keep the
          service secure. We do not sell personal data and do not use it for
          advertising.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <ul>
          <li>
            <b>Identity providers.</b> Google, X and KingsChat when a user
            chooses them; they see that the user signed in to a Decane-powered
            application.
          </li>
          <li>
            <b>Message delivery.</b> An SMS provider receives phone numbers to
            deliver one-time codes; an email provider receives addresses to
            deliver codes and new-device notices.
          </li>
          <li>
            <b>Infrastructure.</b> Our API and database run on rented servers;
            the signing enclave runs on a confidential-computing host. These
            providers process encrypted data on our behalf and cannot open key
            shares.
          </li>
          <li>
            <b>The application you sign in to.</b> It receives your wallet
            addresses, your sign-in identifier and, at sign-in only, the profile
            the provider returned.
          </li>
          <li>
            <b>Authorities.</b> When the law requires it, and we will tell you
            unless we are legally prevented.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <>
        <p>
          This site stores your theme choice and whether you have dismissed the
          cookie notice in your browser&rsquo;s local storage. It sets no
          cookies. The dashboard sets one session cookie when you sign in, which
          expires when the session does. Applications built on Decane keep a
          wallet session in the browser or on the device; what they store is
          described in their own policies.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <>
        <p>
          Key shares and wallet addresses are kept for as long as the wallet
          exists, and for a period after the developer&rsquo;s account ends so
          that users who still hold a device share or recovery file can get back
          in. Hashed sign-in identifiers are kept with the wallet. One-time
          codes expire within minutes. Request logs are kept for a short, fixed
          period. Developer account data is deleted when the account is deleted,
          except billing records we must keep by law.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>
          You can ask us what we hold about you, ask for it to be corrected, ask
          for a copy, or ask for it to be deleted. Deleting a wallet&rsquo;s
          shares makes the wallet unrecoverable through us, so we will confirm
          that with you first. Write to{" "}
          <a href="mailto:info@decane.app" className="ulink">
            info@decane.app
          </a>
          . If you are in a region with a data-protection authority, you can
          also complain to it.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <>
        <p>
          Shares are encrypted at rest with a key the enclave does not have. The
          enclave is an Intel TDX confidential virtual machine whose measurement
          both client SDKs verify before trusting it. Sessions are short-lived
          signed tokens. We limit who can reach production, keep backups
          encrypted, and email users when their wallet is opened from an unseen
          device. No system is perfectly secure; if we learn of a breach
          affecting you, we will tell you promptly.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <>
        <p>
          The service is not directed at children under 13, or under the age of
          digital consent where you live if that is higher. Applications built
          on Decane are responsible for their own age requirements.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <>
        <p>
          We will post changes here with a new date, and email developers about
          material ones. Questions and requests:{" "}
          <a href="mailto:info@decane.app" className="ulink">
            info@decane.app
          </a>
          .{" "}
          <em>
            Operator: add the legal entity name and registered address before
            publishing.
          </em>
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lede="What we collect to run a wallet, what we never see, and how long we keep it."
      updated="26 September 2026"
      summary={[
        "We keep a hashed sign-in identifier, wallet addresses and one encrypted key share per wallet.",
        "We never hold a complete private key, a password, a passkey or a profile picture.",
        "No analytics, no tracking cookies. Your theme choice lives in your browser.",
        "Email info@decane.app to see, correct or delete what we hold about you.",
      ]}
      sections={SECTIONS}
    />
  );
}
