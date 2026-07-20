import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://decane.app";
const TITLE = "decane-connect-kit — connect any wallet, or skip the wallet entirely";
const DESCRIPTION =
  "One SDK for EVM, Solana, Tron, and Bitcoin wallet connections, plus non-custodial Google & email sign-in for users who don't have a wallet yet. CAIP-25 sessions, zero window.ethereum, MIT licensed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — decane-connect-kit" },
  description: DESCRIPTION,
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

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "decane-connect-kit",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  softwareVersion: "1.0.0",
  license: "https://opensource.org/licenses/MIT",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
