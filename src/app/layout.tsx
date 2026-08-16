import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://kit.decane.app";
const TITLE = "decane-connect-kit";
const DESCRIPTION =
  "Connect EVM, Solana, Tron & Bitcoin wallets, or skip wallets with non-custodial Google/email sign-in. CAIP-25 sessions, zero window.ethereum, MIT licensed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — decane-connect-kit" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  keywords: [
    "wallet connect",
    "EVM wallet SDK",
    "Solana wallet adapter",
    "Tron wallet connect",
    "Bitcoin wallet connect",
    "EIP-6963",
    "CAIP-25",
    "social login web3",
    "non-custodial embedded wallet",
    "Google sign-in wallet",
    "MPC wallet",
  ],
  authors: [{ name: "decane" }],
  icons: { icon: "/icon.svg" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "decane-connect-kit",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// SoftwareApplication covers the OSS wallet-connect SDK (free, MIT). The
// hosted social sign-in product's real tiers/prices are declared separately
// as Offer entries below, rather than folded into one Offer here — they're
// two different things (a free library vs. a metered hosted service).
const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "decane-connect-kit",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  softwareVersion: "1.0.0",
  license: "https://opensource.org/licenses/MIT",
  downloadUrl: "https://www.npmjs.com/package/decane-connect-kit",
};

// Real tier prices, kept in sync with src/app/pricing/page.tsx's TIERS array.
const PRICING_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "decane social sign-in",
  description: "Hosted non-custodial Google/email sign-in that creates a real EVM and Solana wallet.",
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
    { "@type": "Offer", name: "Scale (500–2,499 MAU)", price: "254", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
    { "@type": "Offer", name: "Scale (2,500–9,999 MAU)", price: "424", priceCurrency: "USD", url: `${SITE_URL}/pricing` },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SOFTWARE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICING_JSON_LD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
