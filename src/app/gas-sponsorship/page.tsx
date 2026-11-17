"use client";

import { ChainTypeIcon } from "@/components/ChainIcon";
import { CheckIcon } from "@/components/Icons";
import { ProductPage, PSection, Cards, Steps, Code, Faq } from "@/components/ProductPage";

// Gas sponsorship: web SDK 2.32.0 and Expo 0.7.0, early access, self-serve
// from the dashboard (payout wallet, switch, prepaid gas tank, limits). Only what the code does
// is said here: no fee percentage until it is published (product-briefs/).

const SEND = `// The project pays the gas. The user just confirms.
const { transactionHash } = await decane.sendSponsoredTransaction({
  chain: "evm:8453",
  to: shop,
  data: checkoutCall,
});

// Or the user pays the fee in USDC, never touching ETH.
await decane.sendSponsoredTransaction({
  chain: "evm:8453",
  to: shop,
  data: checkoutCall,
  payGasWith: { token: USDC },
});`;

const CONFIG = `<DecaneKit config={{
  social: {
    apiKey: "dck_live_…",
    // Pay in USDC unless a send says otherwise
    gasSponsorship: { payGasWith: { token: USDC } },
  },
}}>`;

const Sheet = () => (
  <div className="p-sheet" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span className="pm-app">N</span>
        <span>Confirm payment</span>
      </div>
      <div className="pm-body">
        <div className="pm-amount">
          <span className="pm-token">$</span>
          <b>25.00</b> USDC
        </div>
        <dl className="pm-list">
          <div>
            <dt>To</dt>
            <dd>shop.base.eth</dd>
          </div>
          <div>
            <dt>Network</dt>
            <dd>
              <ChainTypeIcon type="evm" size={12} /> Base
            </dd>
          </div>
          <div>
            <dt>Network fee</dt>
            <dd>
              <span className="pm-free">Free</span>
              <small>Paid by Northgate</small>
            </dd>
          </div>
        </dl>
        <span className="pm-btn primary">Confirm</span>
      </div>
    </div>
    <div className="pm-toast static">
      <i>
        <CheckIcon size={10} />
      </i>
      Sent · no ETH needed
    </div>
  </div>
);

export default function GasPage() {
  return (
    <ProductPage
      eyebrow="Gas sponsorship"
      badge="Early access"
      secondary={{ label: "Switch it on for your project", href: "mailto:info@decane.app?subject=Gas%20sponsorship" }}
      title="Your users never need gas"
      lede="A new user has a wallet but no ETH to move anything with. Sponsor the transaction and they just send: your project covers the fee, or they pay it in USDC. Same wallet, same address."
      art={<Sheet />}
      closeTitle="Remove the last crypto step from your app"
      closeText="Gas sponsorship is in early access: install the SDK, set a payout wallet and turn it on from your project's Gas sponsorship page."
    >
      <PSection title="Two ways to pay for gas" lead="You choose per app, and can override it per send.">
        <Cards
          items={[
            {
              tag: "Default",
              title: "Your project pays",
              body: "Sends are sponsored from your project's gas balance. The user signs and it lands; they never see a fee or hold ETH.",
            },
            {
              tag: "Pay in USDC",
              title: "The user pays, in a token",
              body: "The fee comes out of the user's USDC instead of ETH. The token approval is capped at twice the worst case, never unlimited.",
            },
          ]}
        />
      </PSection>

      <PSection title="Two calls" lead="Sponsored sends sit next to the wallet you already use: one method, the same chain ids.">
        <div className="p-split">
          <Code file="checkout.ts" code={SEND} />
          <div className="p-notes">
            <Code file="app.tsx" code={CONFIG} />
            <ul className="p-ticks">
              <li>Several calls in one send land together, atomically</li>
              <li>A first send upgrades the wallet in place (EIP-7702); the address never changes</li>
              <li>Ordinary <code>sendTransaction</code> stays an ordinary transaction unless you route it</li>
            </ul>
          </div>
        </div>
      </PSection>

      <PSection title="How it works" tinted>
        <Steps
          items={[
            { title: "Turn it on", body: "On your project's Gas sponsorship page: set the payout wallet that receives users' token payments, then switch it on." },
            { title: "Fund it", body: "Top up the project's gas tank in USDC or USDT from the dashboard. Sponsored sends are paid from it; an empty tank stops sponsoring, and nothing is billed afterwards." },
            { title: "Set the limits", body: "Caps per transaction, per user per day and per project per day, enforced before anything is signed." },
            { title: "Users send", body: "The wallet builds the operation, the enclave signs it, and it lands on chain with the fee paid." },
          ]}
        />
      </PSection>

      <PSection title="Built so it can't be turned against your users">
        <Cards
          items={[
            {
              title: "Contracts pinned in the SDK",
              body: "Sends use only the EntryPoint, paymaster and wallet contract pinned in the SDK. A breached server cannot point a wallet at its own contract.",
            },
            {
              title: "Only the user's own wallet",
              body: "A signed-in user can only have operations for their own address sponsored, and each session is held to 120 calls a minute.",
            },
            {
              title: "Nothing secret reaches a client",
              body: "Sends go through Decane's proxy, which speaks to the sponsor platform for your project. No key or credential for it reaches a browser or a phone.",
            },
            {
              title: "Off when it should be",
              body: "A frozen wallet sponsors nothing, and a suspended project stops sponsoring the moment it is suspended.",
            },
          ]}
        />
      </PSection>

      <PSection title="Questions">
        <Faq
          items={[
            { q: "Which networks?", a: "Base first. More EVM chains follow; the dashboard will list each one as it goes live." },
            { q: "Does the wallet address change?", a: "No. The first sponsored send upgrades the existing wallet in place with EIP-7702, so balances, history and the address stay the same." },
            { q: "Which SDKs?", a: "The web SDK and the React Native (Expo) SDK, with the same calls in both." },
            { q: "What does it cost?", a: "The gas your users' sends use, plus a small platform fee. The fee will be on the pricing page before sponsorship goes live." },
            { q: "When can I use it?", a: "Now, in early access. Install decane-connect-kit 2.32.0 or decane-connect-kit-expo 0.7.0 or later, set a payout wallet and turn it on from your project's Gas sponsorship page in the dashboard." },
            { q: "Can I earn on gas?", a: "Yes. When a user pays the gas in a token, the payment goes to your payout wallet, and the markup you set on that token (up to 50%) is yours to keep." },
          ]}
        />
      </PSection>
    </ProductPage>
  );
}
