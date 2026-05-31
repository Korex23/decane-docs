"use client";
import { useState, useMemo } from "react";
import { ChainIcon } from "@/components/ChainIcon";

type ChainCat = "all" | "evm-tier1" | "evm-ext" | "solana" | "tron" | "bitcoin" | "dev";

const CHAINS_DATA = [
  // Tier-1 EVM
  { name: "Ethereum", id: "eip155:1", constant: "CHAINS.ETHEREUM", cat: "evm-tier1" },
  { name: "Base", id: "eip155:8453", constant: "CHAINS.BASE", cat: "evm-tier1" },
  { name: "Arbitrum One", id: "eip155:42161", constant: "CHAINS.ARBITRUM", cat: "evm-tier1" },
  { name: "Optimism", id: "eip155:10", constant: "CHAINS.OPTIMISM", cat: "evm-tier1" },
  { name: "BNB Chain", id: "eip155:56", constant: "CHAINS.BNB", cat: "evm-tier1" },
  { name: "Polygon", id: "eip155:137", constant: "CHAINS.POLYGON", cat: "evm-tier1" },
  // Extended EVM
  { name: "Abstract", id: "eip155:2741", constant: "CHAINS.ABSTRACT", cat: "evm-ext" },
  { name: "Ancient8", id: "eip155:888888888", constant: "CHAINS.ANCIENT8", cat: "evm-ext" },
  { name: "Animechain", id: "eip155:69000", constant: "CHAINS.ANIMECHAIN", cat: "evm-ext" },
  { name: "ApeChain", id: "eip155:33139", constant: "CHAINS.APE_CHAIN", cat: "evm-ext" },
  { name: "Arbitrum Nova", id: "eip155:42170", constant: "CHAINS.ARBITRUM_NOVA", cat: "evm-ext" },
  { name: "Avalanche", id: "eip155:43114", constant: "CHAINS.AVALANCHE", cat: "evm-ext" },
  { name: "B3", id: "eip155:8333", constant: "CHAINS.B3", cat: "evm-ext" },
  { name: "Berachain", id: "eip155:80094", constant: "CHAINS.BERACHAIN", cat: "evm-ext" },
  { name: "Blast", id: "eip155:81457", constant: "CHAINS.BLAST", cat: "evm-ext" },
  { name: "BOB", id: "eip155:60808", constant: "CHAINS.BOB", cat: "evm-ext" },
  { name: "Boba Network", id: "eip155:288", constant: "CHAINS.BOBA", cat: "evm-ext" },
  { name: "Celo", id: "eip155:42220", constant: "CHAINS.CELO", cat: "evm-ext" },
  { name: "Corn", id: "eip155:21000000", constant: "CHAINS.CORN", cat: "evm-ext" },
  { name: "Cronos", id: "eip155:25", constant: "CHAINS.CRONOS", cat: "evm-ext" },
  { name: "Cyber", id: "eip155:7560", constant: "CHAINS.CYBER", cat: "evm-ext" },
  { name: "Degen", id: "eip155:666666666", constant: "CHAINS.DEGEN", cat: "evm-ext" },
  { name: "Flow EVM", id: "eip155:747", constant: "CHAINS.FLOW_EVM", cat: "evm-ext" },
  { name: "Gnosis", id: "eip155:100", constant: "CHAINS.GNOSIS", cat: "evm-ext" },
  { name: "Gunz", id: "eip155:49321", constant: "CHAINS.GUNZ", cat: "evm-ext" },
  { name: "Hemi", id: "eip155:43111", constant: "CHAINS.HEMI", cat: "evm-ext" },
  { name: "HyperEVM", id: "eip155:999", constant: "CHAINS.HYPER_EVM", cat: "evm-ext" },
  { name: "Ink", id: "eip155:57073", constant: "CHAINS.INK", cat: "evm-ext" },
  { name: "Linea", id: "eip155:59144", constant: "CHAINS.LINEA", cat: "evm-ext" },
  { name: "Lisk", id: "eip155:1135", constant: "CHAINS.LISK", cat: "evm-ext" },
  { name: "Manta Pacific", id: "eip155:169", constant: "CHAINS.MANTA_PACIFIC", cat: "evm-ext" },
  { name: "Mantle", id: "eip155:5000", constant: "CHAINS.MANTLE", cat: "evm-ext" },
  { name: "MegaETH", id: "eip155:6342", constant: "CHAINS.MEGA_ETH", cat: "evm-ext" },
  { name: "Metis", id: "eip155:1088", constant: "CHAINS.METIS", cat: "evm-ext" },
  { name: "Mode", id: "eip155:34443", constant: "CHAINS.MODE", cat: "evm-ext" },
  { name: "Monad", id: "eip155:10143", constant: "CHAINS.MONAD", cat: "evm-ext" },
  { name: "Morph", id: "eip155:2818", constant: "CHAINS.MORPH", cat: "evm-ext" },
  { name: "Plume", id: "eip155:98866", constant: "CHAINS.PLUME", cat: "evm-ext" },
  { name: "RARI", id: "eip155:1380012617", constant: "CHAINS.RARI", cat: "evm-ext" },
  { name: "Redstone", id: "eip155:690", constant: "CHAINS.REDSTONE", cat: "evm-ext" },
  { name: "Ronin", id: "eip155:2020", constant: "CHAINS.RONIN", cat: "evm-ext" },
  { name: "Scroll", id: "eip155:534352", constant: "CHAINS.SCROLL", cat: "evm-ext" },
  { name: "Sei", id: "eip155:1329", constant: "CHAINS.SEI", cat: "evm-ext" },
  { name: "Shape", id: "eip155:360", constant: "CHAINS.SHAPE", cat: "evm-ext" },
  { name: "Somnia", id: "eip155:50312", constant: "CHAINS.SOMNIA", cat: "evm-ext" },
  { name: "Soneium", id: "eip155:1868", constant: "CHAINS.SONEIUM", cat: "evm-ext" },
  { name: "Sonic", id: "eip155:146", constant: "CHAINS.SONIC", cat: "evm-ext" },
  { name: "Story", id: "eip155:1514", constant: "CHAINS.STORY", cat: "evm-ext" },
  { name: "Superposition", id: "eip155:55244", constant: "CHAINS.SUPERPOSITION", cat: "evm-ext" },
  { name: "Superseed", id: "eip155:5330", constant: "CHAINS.SUPERSEED", cat: "evm-ext" },
  { name: "SwellChain", id: "eip155:1923", constant: "CHAINS.SWELL_CHAIN", cat: "evm-ext" },
  { name: "Taiko", id: "eip155:167000", constant: "CHAINS.TAIKO", cat: "evm-ext" },
  { name: "Unichain", id: "eip155:130", constant: "CHAINS.UNICHAIN", cat: "evm-ext" },
  { name: "World Chain", id: "eip155:480", constant: "CHAINS.WORLD_CHAIN", cat: "evm-ext" },
  { name: "ZERO", id: "eip155:543210", constant: "CHAINS.ZERO", cat: "evm-ext" },
  { name: "Zircuit", id: "eip155:48900", constant: "CHAINS.ZIRCUIT", cat: "evm-ext" },
  { name: "zkSync Era", id: "eip155:324", constant: "CHAINS.ZKSYNC_ERA", cat: "evm-ext" },
  { name: "Zora", id: "eip155:7777777", constant: "CHAINS.ZORA", cat: "evm-ext" },
  // Dev
  { name: "Localhost", id: "eip155:31337", constant: "CHAINS.LOCALHOST", cat: "dev" },
  // Solana
  { name: "Solana", id: "solana:mainnet", constant: "CHAINS.SOLANA", cat: "solana" },
  { name: "Solana Devnet", id: "solana:devnet", constant: "CHAINS.SOLANA_DEVNET", cat: "solana" },
  // Tron
  { name: "Tron", id: "tron:mainnet", constant: "CHAINS.TRON", cat: "tron" },
  { name: "Tron Shasta Testnet", id: "tron:shasta", constant: "CHAINS.TRON_SHASTA", cat: "tron" },
  // Bitcoin
  { name: "Bitcoin", id: "bip122:mainnet", constant: "CHAINS.BITCOIN", cat: "bitcoin" },
] as const;

const CHIPS: { id: ChainCat; label: React.ReactNode }[] = [
  { id: "all", label: "All" },
  {
    id: "evm-tier1",
    label: (
      <>
        <span className="docs-swatch-mini" style={{ background: "oklch(78% 0.13 240)" }} />
        Tier-1 EVM
      </>
    ),
  },
  {
    id: "evm-ext",
    label: (
      <>
        <span className="docs-swatch-mini" style={{ background: "oklch(72% 0.13 240)" }} />
        Extended EVM
      </>
    ),
  },
  {
    id: "solana",
    label: (
      <>
        <span className="docs-swatch-mini" style={{ background: "oklch(78% 0.18 290)" }} />
        Solana
      </>
    ),
  },
  {
    id: "tron",
    label: (
      <>
        <span className="docs-swatch-mini" style={{ background: "oklch(76% 0.18 25)" }} />
        Tron
      </>
    ),
  },
  {
    id: "bitcoin",
    label: (
      <>
        <span className="docs-swatch-mini" style={{ background: "oklch(80% 0.14 65)" }} />
        Bitcoin
      </>
    ),
  },
  {
    id: "dev",
    label: (
      <>
        <span className="docs-swatch-mini" style={{ background: "var(--doc-text-muted)" }} />
        Dev
      </>
    ),
  },
];

export function ChainTable() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<ChainCat>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHAINS_DATA.filter((chain) => {
      const matchCat =
        activeCat === "all" || chain.cat === activeCat;
      const txt = `${chain.name} ${chain.id} ${chain.constant}`.toLowerCase();
      const matchQ = !q || txt.includes(q);
      return matchCat && matchQ;
    });
  }, [query, activeCat]);

  return (
    <>
      <div className="docs-chains-toolbar">
        <input
          type="text"
          placeholder="Filter by name or chain ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="docs-chip-row">
          {CHIPS.map((chip) => (
            <button
              key={chip.id}
              className={`docs-chip${activeCat === chip.id ? " active" : ""}`}
              onClick={() => setActiveCat(chip.id)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>
      <div className="docs-filepath" style={{ marginBottom: 8 }}>
        {filtered.length} of {CHAINS_DATA.length} chains
      </div>
      <div className="docs-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: "30%", whiteSpace: "nowrap" }}>CAIP-2 ID</th>
              <th style={{ width: "30%", whiteSpace: "nowrap" }}>
                <code>CHAINS</code> constant
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((chain) => (
              <tr key={chain.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ChainIcon chainId={chain.id} name={chain.name} size={20} radius={5} />
                    {chain.name}
                  </div>
                </td>
                <td>
                  <code>{chain.id}</code>
                </td>
                <td>
                  <code>{chain.constant}</code>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "var(--doc-text-muted)", padding: "20px 14px" }}>
                  No chains match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
