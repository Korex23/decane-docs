"use client";

import { ChainTypeIcon } from "@/components/ChainIcon";
import { CheckIcon } from "@/components/Icons";
import { ProductPage, PSection, Cards, Steps, Code, Faq } from "@/components/ProductPage";

// Decane Payments: hosted checkout (pay-in) and cross-chain withdrawals
// (pay-out) over Dextopus, self-serve from the dashboard. Only what the code
// does is said here: no fee rate until it is published, and the server ports
// beyond Node are named as following, not shipped.

const SERVER = `import { DecaneClient } from "decane-node";

const decane = new DecaneClient({ projectSecret: process.env.DECANE_PROJECT_SECRET });

// 25 USDC (6 decimals), settled to your address.
const checkout = await decane.createCheckout({
  amount: "25000000",
  orderRef: "order_42",
  successUrl: "https://shop.example/thanks",
});

redirect(checkout.url); // the hosted checkout page`;

const WEBHOOK = `// POST from Decane, signed with your webhook secret
if (event.event === "payment.completed") {
  fulfil(event.data.orderRef); // paid, settled to you
}`;

const EMBED = `import { DecaneCheckout } from "decane-connect-kit";

<DecaneCheckout sessionId={checkout.id} onPaid={showReceipt} />`;

const Sheet = () => (
  <div className="p-sheet" aria-hidden="true">
    <div className="pm-win">
      <div className="pm-head">
        <span className="pm-app">N</span>
        <span>Pay Northgate</span>
      </div>
      <div className="pm-body">
        <div className="pm-amount">
          <span className="pm-token">$</span>
          <b>25.00</b> USDC
        </div>
        <dl className="pm-list">
          <div>
            <dt>Pay with</dt>
            <dd>
              <ChainTypeIcon type="solana" size={12} /> SOL on Solana
            </dd>
          </div>
          <div>
            <dt>Send exactly</dt>
            <dd>
              <b>0.1384 SOL</b>
              <small>Expires in 9:41</small>
            </dd>
          </div>
          <div>
            <dt>Settles as</dt>
            <dd>
              <ChainTypeIcon type="evm" size={12} /> USDC on Base
            </dd>
          </div>
        </dl>
        <span className="pm-btn primary">Waiting for payment…</span>
      </div>
    </div>
    <div className="pm-toast static">
      <i>
        <CheckIcon size={10} />
      </i>
      Paid · 25.00 USDC settled to Northgate
    </div>
  </div>
);

export default function PaymentsPage() {
  return (
    <ProductPage
      eyebrow="Payments"
      badge="Early access"
      secondary={{ label: "Turn it on in the dashboard", href: "https://dashboard.decane.app" }}
      title="Get paid in crypto, on any major network. Receive USDC."
      lede="Create a checkout from your server and send your customer the link. They pay in whatever they hold, on the network they hold it on; the payment settles as USDC to your address, and your server gets a signed webhook."
      art={<Sheet />}
      closeTitle="Take crypto payments without running a bridge"
      closeText="Set your settlement address in the dashboard, turn Payments on, and create your first checkout with one server call."
    >
      <PSection title="One checkout, many networks" lead="Your customer chooses how to pay. You always receive the same thing.">
        <Cards
          items={[
            {
              tag: "For the payer",
              title: "Coins and stablecoins on 70+ networks",
              body: "They search for the network they pay from (every EVM network Dextopus routes, from Ethereum, Base and Arbitrum to Linea, Monad and HyperEVM, plus Solana and Tron where you have an address), then pick its native coin, USDC or USDT. A slightly wrong amount still reaches you."
            },
            {
              tag: "For you",
              title: "USDC at your address",
              body: "Every payment settles to the address you set, by default USDC on Base. No volatile tokens on your books, and nothing held by Decane.",
            },
            {
              tag: "Decane wallets",
              title: "One tap to approve",
              body: "Customers signed in with a Decane wallet approve the payment in the embedded checkout; the wallet signs the transfer for them.",
            },
          ]}
        />
      </PSection>

      <PSection title="One call to charge, one webhook to fulfil" lead="Create the checkout on your server, send the link or embed it, and fulfil on payment.completed.">
        <div className="p-split">
          <Code file="checkout.ts" code={SERVER} />
          <div className="p-notes">
            <Code file="webhook.ts" code={WEBHOOK} />
            <Code file="page.tsx" code={EMBED} />
            <ul className="p-ticks">
              <li>Checkouts expire after 10 minutes by default (1 to 60)</li>
              <li>Look a payment up any time with getPayment, or list them</li>
              <li>Static deposit addresses per user, for top-up style apps</li>
            </ul>
          </div>
        </div>
      </PSection>

      <PSection title="How it works" tinted>
        <Steps
          items={[
            { title: "Set where you get paid", body: "On your project's Payments page: one EVM address (used on every EVM network), plus optional Solana and Tron addresses. At least one is required." },
            { title: "Turn it on", body: "One switch once an address is set. Give your server key the Accept payments scope." },
            { title: "Create a checkout", body: "Your server calls createCheckout with the amount. You get a checkout id and a hosted payment link." },
            { title: "Your customer pays", body: "They choose a network and a token, and send the exact amount shown before the countdown ends. The page follows the payment on its own." },
            { title: "You get paid", body: "It settles as USDC to your address, and payment.completed arrives at your webhook, signed with your project's secret." },
          ]}
        />
      </PSection>

      <PSection title="Withdrawals, too" lead="The same engine in reverse: send what you hold and settle it anywhere.">
        <Cards
          items={[
            {
              title: "Cross-chain in one call",
              body: "createWithdrawal takes what you send (say USDC on Base) and settles it to any chain, asset and address you name.",
            },
            {
              title: "From your treasury or a user's wallet",
              body: "Your server sends to the deposit address it is given, or a Decane wallet signs the transfer itself.",
            },
          ]}
        />
      </PSection>

      <PSection title="Built so nobody pays the wrong amount">
        <Cards
          items={[
            {
              title: "Exact, strict quotes",
              body: "Each checkout quotes the exact amount to send. Too little is refunded whole; too much has the excess refunded.",
            },
            {
              title: "Refunds come to you",
              body: "A payment that can't settle is refunded to your own address on the payer's network, so you, not a stranger's typo, handle it with your customer.",
            },
            {
              title: "Only addresses Decane issued",
              body: "The deposit address always comes from Decane's quote, never from the browser, and the page shows the payer exactly which network to use.",
            },
            {
              title: "Signed notifications",
              body: "payment.completed, payment.failed and payment.expired are signed like every Decane webhook. Verify, then fulfil.",
            },
          ]}
        />
      </PSection>

      <PSection title="Questions">
        <Faq
          items={[
            { q: "Which networks can customers pay from?", a: "Every network Dextopus routes where you have an address: over 70 EVM networks (Ethereum, Base, Arbitrum, Optimism, Polygon, BNB Chain, Avalanche, Linea and more) with your one EVM address, plus Solana and Tron if you set those. New EVM networks appear as Dextopus adds them. Bitcoin is next." },
            { q: "What do I receive?", a: "USDC (or USDT on Tron) at the address you set, on Base by default when you have an EVM address. You can name another settlement network per checkout." },
            { q: "Do my customers need a Decane wallet?", a: "No. Anyone can pay from any wallet or exchange using the link. Customers with a Decane wallet can approve in one tap in the embedded checkout." },
            { q: "What happens if someone sends the wrong amount?", a: "The quote is strict: an underpayment is refunded in full and an overpayment has the excess refunded, both to your address on the payer's network, so you can sort it out with them." },
            { q: "What does it cost?", a: "Network and routing costs are inside the quote, so the payer sees one exact amount. Decane's fee will be published on the pricing page." },
            { q: "Which SDKs?", a: "decane-node 1.7.0 or later on your server (Python and Rust ports follow), and decane-connect-kit 2.34.0 or later for the embedded checkout. Or call the HTTP API directly." },
          ]}
        />
      </PSection>
    </ProductPage>
  );
}
