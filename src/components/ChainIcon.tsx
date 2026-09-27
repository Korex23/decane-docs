"use client";
import { useState } from "react";

// ── DefiLlama CDN slugs for supported chains ─────────────────────────────────
// URL pattern: https://icons.llamao.fi/icons/chains/rsz_{slug}
const LLAMA_SLUGS: Record<string, string> = {
  // Tier-1 EVM
  "eip155:1": "ethereum",
  "eip155:8453": "base",
  "eip155:42161": "arbitrum",
  "eip155:10": "optimism",
  "eip155:56": "bsc",
  "eip155:137": "polygon",
  // Extended EVM
  "eip155:43114": "avax",
  "eip155:42220": "celo",
  "eip155:100": "xdai",
  "eip155:534352": "scroll",
  "eip155:59144": "linea",
  "eip155:324": "zksync%20era",
  "eip155:5000": "mantle",
  "eip155:81457": "blast",
  "eip155:7777777": "zora",
  "eip155:2020": "ronin",
  "eip155:34443": "mode",
  "eip155:167000": "taiko",
  "eip155:1088": "metis",
  "eip155:288": "boba",
  "eip155:42170": "arbitrum%20nova",
  "eip155:25": "cronos",
  "eip155:1329": "sei",
  "eip155:80094": "berachain",
  "eip155:130": "unichain",
  "eip155:480": "worldchain",
  "eip155:33139": "apechain",
  "eip155:169": "manta",
  "eip155:690": "redstone",
  "eip155:146": "sonic",
  "eip155:1868": "soneium",
  "eip155:57073": "ink",
  "eip155:60808": "bob",
};

// ── Fallback colours by chain prefix ─────────────────────────────────────────
function fallbackColor(chainId: string): string {
  if (chainId.startsWith("eip155:")) return "#627EEA";
  if (chainId.startsWith("solana:")) return "#66F9A1";
  if (chainId.startsWith("tron:")) return "#EF0027";
  if (chainId.startsWith("bip122:")) return "#F7931A";
  return "#8A8884";
}

// ── Official inline SVGs for the 4 chain type headers ────────────────────────
// (from cryptocurrency-icons MIT, fetched from cdn.jsdelivr.net)

export const CHAIN_TYPE_SVGS = {
  evm: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA"/><g fill="#FFF" fill-rule="nonzero"><path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.028L9 17.616z"/><path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></g></svg>`,
  solana: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none"><circle fill="#66F9A1" cx="16" cy="16" r="16"/><path d="M9.925 19.687a.59.59 0 01.415-.17h14.366a.29.29 0 01.207.497l-2.838 2.815a.59.59 0 01-.415.171H7.294a.291.291 0 01-.207-.498l2.838-2.815zm0-10.517A.59.59 0 0110.34 9h14.366c.261 0 .392.314.207.498l-2.838 2.815a.59.59 0 01-.415.17H7.294a.291.291 0 01-.207-.497L9.925 9.17zm12.15 5.225a.59.59 0 00-.415-.17H7.294a.291.291 0 00-.207.498l2.838 2.815c.11.109.26.17.415.17h14.366a.291.291 0 00.207-.498l-2.838-2.815z" fill="#1C1C1C"/></g></svg>`,
  tron: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none"><circle fill="#EF0027" cx="16" cy="16" r="16"/><path d="M21.932 9.913L7.5 7.257l7.595 19.112 10.583-12.894-3.746-3.562zm-.232 1.17l2.208 2.099-6.038 1.093 3.83-3.192zm-5.142 2.973l-6.364-5.278 10.402 1.914-4.038 3.364zm-.453.934l-1.038 8.58L9.472 9.487l6.633 5.502zm.96.455l6.687-1.21-7.67 9.343.983-8.133z" fill="#FFF"/></g></svg>`,
  bitcoin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path fill="#FFF" fill-rule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/></g></svg>`,
};

// ── ChainIcon component ───────────────────────────────────────────────────────

interface ChainIconProps {
  chainId: string;
  name: string;
  size?: number;
  radius?: number;
}

export function ChainIcon({
  chainId,
  name,
  size = 20,
  radius = 4,
}: ChainIconProps) {
  const [errored, setErrored] = useState(false);
  const slug = LLAMA_SLUGS[chainId];

  if (slug && !errored) {
    return (
      <img
        src={`https://icons.llamao.fi/icons/chains/rsz_${slug}`}
        alt={name}
        width={size}
        height={size}
        style={{
          borderRadius: radius,
          objectFit: "cover",
          flexShrink: 0,
          display: "block",
        }}
        onError={() => setErrored(true)}
      />
    );
  }

  // Inline SVG for non-EVM chains
  if (
    chainId.startsWith("solana:") ||
    chainId.startsWith("tron:") ||
    chainId.startsWith("bip122:")
  ) {
    const key = chainId.startsWith("solana:")
      ? "solana"
      : chainId.startsWith("tron:")
        ? "tron"
        : "bitcoin";
    return (
      <img
        src={`data:image/svg+xml,${encodeURIComponent(CHAIN_TYPE_SVGS[key])}`}
        alt={name}
        width={size}
        height={size}
        style={{
          borderRadius: radius,
          objectFit: "cover",
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }

  // Coloured circle fallback
  const color = fallbackColor(chainId);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        flexShrink: 0,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.floor(size * 0.46),
        fontWeight: 700,
        color: "#fff",
        lineHeight: 1,
        fontFamily: "var(--doc-font-sans, system-ui)",
      }}
    >
      {name.charAt(0)}
    </div>
  );
}

// ── ChainTypeIcon — for the 4+1 type badges ───────────────────────────────────

interface ChainTypeIconProps {
  type: "evm" | "solana" | "tron" | "bitcoin" | "social";
  size?: number;
}

export function ChainTypeIcon({ type, size = 28 }: ChainTypeIconProps) {
  if (type === "social") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="16" r="16" fill="var(--doc-accent, #F5C800)" />
        <circle cx="16" cy="12" r="4.5" fill="#0d0d0b" fillOpacity=".85" />
        <path
          fill="#0d0d0b"
          fillOpacity=".85"
          d="M7 26.5c0-5 4-8.5 9-8.5s9 3.5 9 8.5H7z"
        />
      </svg>
    );
  }
  return (
    <img
      src={`data:image/svg+xml,${encodeURIComponent(CHAIN_TYPE_SVGS[type])}`}
      alt={type}
      width={size}
      height={size}
      style={{ borderRadius: "50%", display: "block" }}
    />
  );
}
