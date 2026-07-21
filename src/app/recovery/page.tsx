"use client";

import { useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useTheme } from "@/lib/theme";

const FONT = "'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', monospace";

// End-user facing recovery guide. Written for the person who owns a wallet,
// not the developer integrating the SDK — plain language, no API names.
// Naming is kept in step with the wallet modal: "recovery file" (one share,
// safe anywhere) vs "full recovery file" (two shares, bearer secret).

interface Scenario {
  tag: string;
  title: string;
  steps: string[];
}

const SCENARIOS: Scenario[] = [
  {
    tag: "Most people",
    title: "Signing in on a new device",
    steps: [
      "Sign in the way you always do — Google or email.",
      "When prompted, use your fingerprint, face, or device passcode — the same passkey prompt you already use to unlock apps and websites.",
      "Your wallet is back. Same addresses, same balance, nothing to remember.",
    ],
  },
  {
    tag: "Fallback",
    title: "Restoring from your recovery file",
    steps: [
      "Sign in the way you always do — Google or email.",
      "If your device can't find a synced passkey, you'll be asked to upload your recovery file and enter its password.",
      "Your wallet is restored and a fresh passkey is set up here, so next time you're back to the easy way. You'll be given a new recovery file — save it, the old one stops working.",
    ],
  },
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "Why is my recovery file safe to keep in a password manager?",
    a: "It holds only one of the three pieces that protect your wallet. One piece on its own can't sign anything or move funds — it isn't a smaller secret, it's no secret. That's the real difference from a seed phrase, and it's why storing it in a password manager or cloud drive is fine by design, not a risk you're accepting for convenience.",
  },
  {
    q: "Why does using my recovery file give me a new one?",
    a: "Each time a recovery file restores your wallet, it's retired and a fresh one is issued in its place. You'll be prompted to save the new file right away — do that before moving on. The old one stops working the moment the new one is created.",
  },
  {
    q: "What's a \"full recovery file\" and do I need one?",
    a: "It's an optional, more powerful backup you can create from your wallet settings. Unlike the ordinary recovery file, it contains two of the three pieces — so the file plus its password is complete control of your wallet. Keep it offline (an encrypted USB drive, or printed in a safe), never in a cloud drive. Most people never need one; it exists for anyone who wants their wallet fully recoverable entirely on their own.",
  },
  {
    q: "What if I lose everything?",
    a: "If you lose your device and your recovery file (and any full recovery file), your wallet can't be recovered — not by you, not by anyone. There's no reset-password option. That's a deliberate consequence of only you controlling the wallet, not an oversight. It's why saving a recovery file is worth the one-time minute it takes.",
  },
];

export default function RecoveryGuidePage() {
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const t = setTimeout(async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(".rc-hero", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });
        gsap.utils.toArray<Element>(".rc-reveal").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    }, 80);
    return () => {
      clearTimeout(t);
      ctx?.revert();
    };
  }, []);

  return (
    <div
      data-theme={theme}
      style={{ background: "var(--doc-bg)", color: "var(--doc-text)", fontFamily: FONT, overflowX: "hidden" }}
    >
      <style>{`* { box-sizing: border-box; } a { text-decoration: none; color: inherit; }`}</style>

      <SiteNav theme={theme} onToggleTheme={toggleTheme} />
      <div style={{ height: 60 }} />

      {/* ── HEADER ── */}
      <section className="rc-hero" style={{ padding: "48px 24px 44px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 12,
            color: "var(--doc-accent)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Recovering your wallet
        </div>
        <h1
          style={{
            fontFamily: FONT,
            fontSize: "clamp(34px, 5vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: 18,
            lineHeight: 1.1,
          }}
        >
          Lose your phone,{" "}
          <span style={{ color: "var(--doc-accent)", fontStyle: "italic" }}>keep your wallet.</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--doc-text-muted)", maxWidth: "54ch", margin: "0 auto", lineHeight: 1.65 }}>
          Your wallet is protected by three separate things, and any two of them are enough to open
          it. One lives on your device. One lives with us. One is yours to keep. No single one, on
          its own, can do anything with your wallet — so losing any one of them isn&rsquo;t a
          disaster.
        </p>
      </section>

      {/* ── THREE PIECES ── */}
      <section className="rc-reveal" style={{ padding: "12px 24px 64px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {[
            { n: "01", t: "Your device", d: "Held in your browser, unlocked by your fingerprint, face, or a PIN. Follows you to a new device through your password manager's passkey sync." },
            { n: "02", t: "Our server", d: "Encrypted at rest on the decane key server. We never hold a full key and never sign anything for you." },
            { n: "03", t: "Your recovery file", d: "A small file that's yours to keep, safe in a password manager or cloud drive. One piece alone reveals nothing." },
          ].map((p) => (
            <div
              key={p.n}
              style={{
                background: "var(--doc-surface)",
                border: "1px solid var(--doc-border)",
                borderRadius: 16,
                padding: "24px 22px",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 12, color: "var(--doc-accent)", marginBottom: 12 }}>{p.n}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{p.t}</div>
              <p style={{ fontSize: 13.5, color: "var(--doc-text-muted)", lineHeight: 1.6, margin: 0 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SCENARIOS ── */}
      <section style={{ padding: "0 24px 88px", maxWidth: 900, margin: "0 auto" }}>
        {SCENARIOS.map((s) => (
          <div key={s.title} className="rc-reveal" style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--doc-accent)",
                  border: "1px solid color-mix(in oklab, var(--doc-accent) 35%, transparent)",
                  borderRadius: 100,
                  padding: "3px 10px",
                }}
              >
                {s.tag}
              </span>
              <h2 style={{ fontFamily: FONT, fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 800, letterSpacing: "-0.02em" }}>
                {s.title}
              </h2>
            </div>
            <ol style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0, margin: 0, counterReset: "step" }}>
              {s.steps.map((step, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    background: "var(--doc-surface)",
                    border: "1px solid var(--doc-border)",
                    borderRadius: 12,
                    padding: "16px 18px",
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "color-mix(in oklab, var(--doc-accent) 14%, transparent)",
                      color: "var(--doc-accent)",
                      fontFamily: MONO,
                      fontSize: 13,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 14.5, lineHeight: 1.6, paddingTop: 2 }}>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      {/* ── OFFLINE TOOL ── */}
      <section className="rc-reveal" style={{ padding: "0 24px 88px", maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            background: "color-mix(in oklab, var(--doc-accent) 5%, var(--doc-surface))",
            border: "1px solid color-mix(in oklab, var(--doc-accent) 30%, transparent)",
            borderRadius: 18,
            padding: "32px 30px",
          }}
        >
          <h2 style={{ fontFamily: FONT, fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 14 }}>
            The offline recovery tool
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--doc-text-muted)", lineHeight: 1.7, marginBottom: 14 }}>
            If you&rsquo;ve created a <strong style={{ color: "var(--doc-text)" }}>full recovery file</strong>, this
            standalone tool turns it back into your wallet&rsquo;s private keys — entirely in your
            browser, with no network connection. It&rsquo;s a single self-contained page: save it
            next to your file and it keeps working on its own, indefinitely.
          </p>
          <p style={{ fontSize: 13, color: "var(--doc-text-muted)", lineHeight: 1.7, marginBottom: 22 }}>
            To use it safely: download the page, disconnect from the internet, then open the saved
            file. It never sends your file or keys anywhere.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="/offline-recovery.html"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--doc-accent)",
                color: "var(--doc-accent-text, #1a1505)",
                fontWeight: 700,
                fontSize: 14,
                padding: "12px 20px",
                borderRadius: 10,
              }}
            >
              Open the recovery tool
              <span aria-hidden style={{ fontSize: 15 }}>&rarr;</span>
            </a>
            <a
              href="/offline-recovery.html"
              download="decane-offline-recovery.html"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                border: "1px solid var(--doc-border)",
                color: "var(--doc-text)",
                fontWeight: 600,
                fontSize: 14,
                padding: "12px 20px",
                borderRadius: 10,
              }}
            >
              Download for offline use
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="rc-reveal" style={{ padding: "0 24px 120px", maxWidth: 760, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: FONT,
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            marginBottom: 28,
            textAlign: "center",
          }}
        >
          Questions
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            background: "var(--doc-border)",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--doc-border)",
          }}
        >
          {FAQS.map((f) => (
            <div key={f.q} style={{ background: "var(--doc-surface)", padding: "22px 24px" }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 8 }}>{f.q}</div>
              <p style={{ fontSize: 13.5, color: "var(--doc-text-muted)", lineHeight: 1.65, margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
