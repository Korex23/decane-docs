"use client";

import { LegalPage, type LegalSection } from "@/components/Legal";

// Draft terms. The facts about the product are taken from the codebase; the
// legal framing (entity, governing law) is marked where it still needs the
// operator's input. Have counsel review before publishing.
const SECTIONS: LegalSection[] = [
  {
    id: "who", title: "Who these terms are between",
    body: (
      <>
        <p>These terms are an agreement between you and Decane (&ldquo;Decane&rdquo;, &ldquo;we&rdquo;), the operator of kit.decane.app, dashboard.decane.app and the hosted wallet service behind them. They apply when you create a dashboard account, obtain an API key, integrate a Decane package into your application, or use an application that Decane wallets power.</p>
        <p>If you accept these terms for a company, you confirm you are allowed to bind it.</p>
      </>
    ),
  },
  {
    id: "services", title: "What we provide",
    body: (
      <>
        <p>Two things, under different terms:</p>
        <ul>
          <li><b>The connector SDK.</b> The wallet-connection parts of <code>decane-connect-kit</code> are open source under the MIT licence. That licence, not this agreement, governs your use of that code.</li>
          <li><b>The hosted wallet service.</b> Sign-in relay, wallet creation, the signing enclave, session issuance and the dashboard. This agreement governs the service, which you reach with an API key.</li>
        </ul>
      </>
    ),
  },
  {
    id: "accounts", title: "Accounts and API keys",
    body: (
      <>
        <p>You are responsible for everything done with your API keys and dashboard account. Publishable keys are restricted to the origins you allow-list; secret keys and organisation tokens must never be shipped to a browser or a mobile app. Rotate a key you believe has leaked and tell us at info@decane.app.</p>
        <p>You must give accurate information when you register and keep your contact email current. We send operational notices there, including the notice before wallet creation pauses on a plan limit.</p>
      </>
    ),
  },
  {
    id: "custody", title: "Wallets are non-custodial",
    body: (
      <>
        <p>A wallet&rsquo;s key is split into three shares. Decane holds one, the user&rsquo;s device holds one, and one is sealed inside an attested enclave that only opens for the signed-in user. The key is reconstructed only inside that enclave, for the moment it signs. Decane cannot sign, move funds or recover a wallet on its own, and cannot recover a wallet whose sign-in account and recovery files are all lost.</p>
        <p>You are responsible for choosing a protection tier that fits your application, for telling your users how recovery works, and for honouring your users&rsquo; freeze requests through us. In the identity tier a wallet is exactly as safe as the user&rsquo;s identity-provider account plus Decane; you must not represent it otherwise to your users.</p>
      </>
    ),
  },
  {
    id: "use", title: "Acceptable use",
    body: (
      <>
        <p>You must not use the service to break the law where you or your users are, to launder money or evade sanctions, to attack the service or the enclave, to scrape or resell it, or to create wallets for people without their knowledge. You must comply with the terms of the identity providers you enable (Google, X, KingsChat) and with any obligations you have to your own users, including consent and disclosure.</p>
        <p>We may suspend keys, freeze wallets or terminate accounts that we reasonably believe are being used in breach of this section, and we may do so first and explain afterwards where waiting would cause harm.</p>
      </>
    ),
  },
  {
    id: "fees", title: "Plans and fees",
    body: (
      <>
        <p>The free plan covers up to 499 monthly active wallets. Paid plans are priced by monthly active wallets as shown on the pricing page at the time you subscribe. A wallet is active in a calendar month the first time it signs in or signs something that month.</p>
        <p>If a project exceeds its plan, existing wallets keep working and new wallet creation pauses until the plan is changed; we email the project owner before that happens. Fees are billed monthly in advance, are non-refundable except where the law requires otherwise, and may change with thirty days&rsquo; notice.</p>
      </>
    ),
  },
  {
    id: "availability", title: "Availability and changes",
    body: (
      <>
        <p>We work to keep the service available and give notice of planned maintenance, but we do not guarantee uptime except where an Enterprise agreement says so. Wallets do not depend on our availability to exist: a user with a recovery file can open theirs without us.</p>
        <p>We may change or retire features. Changes that remove a documented capability get at least thirty days&rsquo; notice by email and in the changelog, except where a security issue forces a faster change.</p>
      </>
    ),
  },
  {
    id: "ip", title: "Intellectual property",
    body: (
      <>
        <p>We own the service and the Decane name and marks. You own your application and your users&rsquo; data. You give us the limited licence needed to run the service for you, and nothing more. You may say that your application uses Decane; you may not suggest we endorse it.</p>
      </>
    ),
  },
  {
    id: "disclaimer", title: "Disclaimers",
    body: (
      <>
        <p>The service is provided as is. Blockchains are outside our control: we do not guarantee that a transaction will be included, confirmed or priced as expected, and we are not responsible for the behaviour of networks, tokens, contracts or wallets your users interact with. Nothing on this site is financial, legal or tax advice.</p>
      </>
    ),
  },
  {
    id: "liability", title: "Limitation of liability",
    body: (
      <>
        <p>To the extent the law allows, neither party is liable to the other for indirect, consequential or special loss, or for loss of profits, data or goodwill. Our total liability under this agreement in any twelve months is capped at the fees you paid us in those twelve months, or one hundred US dollars if you paid none. Nothing limits liability for fraud, for death or personal injury caused by negligence, or for anything that cannot be limited by law.</p>
      </>
    ),
  },
  {
    id: "termination", title: "Ending the agreement",
    body: (
      <>
        <p>You can stop using the service and delete your dashboard account at any time. We can end this agreement with thirty days&rsquo; notice, or immediately for a material breach. On termination your users&rsquo; wallets remain theirs: the shares we hold are retained for as long as the privacy policy says, so that a user who still has their device share or recovery file can get back in, and are then deleted.</p>
      </>
    ),
  },
  {
    id: "changes", title: "Changes to these terms",
    body: (
      <>
        <p>We will post changes here with a new date and email account holders about material ones at least fourteen days before they take effect. Continuing to use the service after that date is acceptance of the new terms.</p>
      </>
    ),
  },
  {
    id: "law", title: "Governing law and contact",
    body: (
      <>
        <p>These terms are governed by the laws of the place where Decane is incorporated, and disputes go to the courts there. <em>Operator: fill in the legal entity name, its registered address and the governing jurisdiction before publishing.</em></p>
        <p>Questions about these terms: <a href="mailto:info@decane.app" className="ulink">info@decane.app</a>.</p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lede="Plain terms for the connector SDK, the hosted wallet service and the dashboard."
      updated="26 September 2026"
      summary={[
        "The connector SDK is MIT-licensed; the hosted wallet service runs under these terms with an API key.",
        "Wallets are non-custodial. Decane holds one of three shares and cannot sign or recover a wallet alone.",
        "Plans are priced by monthly active wallets. Over the limit, existing wallets keep working and new creation pauses.",
        "You are responsible for your keys, your users' consent, and describing recovery to them truthfully.",
      ]}
      sections={SECTIONS}
    />
  );
}
