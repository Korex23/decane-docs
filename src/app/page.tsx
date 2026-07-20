"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { useTheme, DASHBOARD_URL, type Theme } from "@/lib/theme";

// ─── types ───────────────────────────────────────────────────────────────────

interface Vec2 {
  x: number;
  y: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  gold: boolean;
}
interface ChainNode {
  label: string;
  color: string;
  angle: number;
  dist: number;
  phase: number;
}

// ─── Decane mascot logo ───────────────────────────────────────────────────────

const DECANE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="68" height="64" viewBox="0 0 68 64" fill="none"><g filter="url(#f0)"><path d="M32.8031 10.2986C33.1971 9.68929 34.0886 9.68929 34.4826 10.2986L35.7297 12.2273C36.1599 12.8926 35.6823 13.7703 34.89 13.7703H32.3957C31.6034 13.7703 31.1257 12.8926 31.556 12.2273L32.8031 10.2986Z" fill="#FFD700"/><path d="M16.6095 20.8798C25.5139 8.28662 47.0755 12.2298 51.4641 20.5617C54.9502 24.0479 55.2167 30.8018 55.2167 30.8018C55.2167 30.8018 58.8421 37.862 57.4428 41.3601C55.7891 56.7522 13.9381 57.0066 11.3304 41.3601C9.93111 37.0351 13.4293 31.3744 13.4293 31.3744C13.4293 31.3744 12.9841 27.2404 16.6095 20.8798Z" fill="#FFD700"/><ellipse cx="48.9999" cy="39.2669" rx="2.38155" ry="1.89957" transform="rotate(-22.395 48.9999 39.2669)" fill="#FFE55F" fill-opacity="0.45"/><ellipse cx="18.9785" cy="39.2671" rx="2.38155" ry="1.89958" transform="rotate(15.8893 18.9785 39.2671)" fill="#FFE55F" fill-opacity="0.26"/><path d="M43.5977 30.7344C43.1619 30.7344 42.6943 30.9653 42.3027 31.4824C41.9107 32.0001 41.6388 32.7597 41.6387 33.6406C41.6387 34.5217 41.9107 35.2821 42.3027 35.7998C42.6943 36.3168 43.1619 36.5479 43.5977 36.5479C44.0332 36.5477 44.5002 36.3166 44.8916 35.7998C45.2837 35.2821 45.5557 34.5217 45.5557 33.6406C45.5556 32.7597 45.2836 32.0001 44.8916 31.4824C44.5002 30.9656 44.0333 30.7345 43.5977 30.7344Z" fill="#1A1A1A" stroke="#F4EBBC" stroke-width="2"/><g filter="url(#f1)"><ellipse cx="0.379512" cy="0.501151" rx="0.379512" ry="0.501151" transform="matrix(-0.961028 -0.276453 -0.276452 0.961028 42.7354 31.0718)" fill="#E9E9E9"/></g><path d="M25.1514 30.7344C25.5871 30.7344 26.0547 30.9653 26.4463 31.4824C26.8383 32.0001 27.1103 32.7597 27.1104 33.6406C27.1104 34.5217 26.8384 35.2821 26.4463 35.7998C26.0547 36.3168 25.5871 36.5479 25.1514 36.5479C24.7158 36.5477 24.2489 36.3166 23.8574 35.7998C23.4654 35.2821 23.1934 34.5217 23.1934 33.6406C23.1934 32.7597 23.4654 32.0001 23.8574 31.4824C24.2489 30.9656 24.7157 30.7345 25.1514 30.7344Z" fill="#1A1A1A" stroke="#F4EBBC" stroke-width="2"/><g filter="url(#f2)"><ellipse cx="26.5179" cy="31.4485" rx="0.379512" ry="0.501151" transform="rotate(-16.0486 26.5179 31.4485)" fill="#E9E9E9"/></g><path d="M26.0107 41.6924C26.0107 41.6924 28.0937 46.399 34.759 46.399C41.008 46.399 43.3109 41.6924 43.3109 41.6924" stroke="#1A1A1A" stroke-linecap="round"/></g><defs><filter id="f0" x="0.589964" y="0.334365" width="66.5809" height="62.9754" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dx="-0.501447" dy="0.401157"/><feGaussianBlur stdDeviation="4.95429"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.996078 0 0 0 0 0.996078 0 0 0 0.12 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7484_4856"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7484_4856" result="shape"/></filter><filter id="f1" x="41.465" y="30.5788" width="1.5338" height="1.73937" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="0.188382" result="effect1_foregroundBlur_7484_4856"/></filter><filter id="f2" x="25.7512" y="30.5788" width="1.5338" height="1.73937" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="0.188382" result="effect1_foregroundBlur_7484_4856"/></filter></defs></svg>`;

// ─── chain icon SVGs (official brand colours + marks) ────────────────────────

// Official icons from cryptocurrency-icons (MIT) + custom social icon
const CHAIN_SVGS: Record<string, string> = {
  // Ethereum — official 6-piece diamond, #627EEA
  EVM: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA"/><g fill="#FFF" fill-rule="nonzero"><path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z"/><path d="M16.498 4L9 16.22l7.498-3.35z"/><path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z"/><path d="M16.498 27.995v-6.028L9 17.616z"/><path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/></g></g></svg>`,

  // Solana — official trifork 3-bar mark, #66F9A1 teal
  Solana: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none"><circle fill="#66F9A1" cx="16" cy="16" r="16"/><path d="M9.925 19.687a.59.59 0 01.415-.17h14.366a.29.29 0 01.207.497l-2.838 2.815a.59.59 0 01-.415.171H7.294a.291.291 0 01-.207-.498l2.838-2.815zm0-10.517A.59.59 0 0110.34 9h14.366c.261 0 .392.314.207.498l-2.838 2.815a.59.59 0 01-.415.17H7.294a.291.291 0 01-.207-.497L9.925 9.17zm12.15 5.225a.59.59 0 00-.415-.17H7.294a.291.291 0 00-.207.498l2.838 2.815c.11.109.26.17.415.17h14.366a.291.291 0 00.207-.498l-2.838-2.815z" fill="#1C1C1C"/></g></svg>`,

  // Tron — official TRX logo, #EF0027 red
  Tron: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none"><circle fill="#EF0027" cx="16" cy="16" r="16"/><path d="M21.932 9.913L7.5 7.257l7.595 19.112 10.583-12.894-3.746-3.562zm-.232 1.17l2.208 2.099-6.038 1.093 3.83-3.192zm-5.142 2.973l-6.364-5.278 10.402 1.914-4.038 3.364zm-.453.934l-1.038 8.58L9.472 9.487l6.633 5.502zm.96.455l6.687-1.21-7.67 9.343.983-8.133z" fill="#FFF"/></g></svg>`,

  // Bitcoin — official ₿ mark, #F7931A orange
  Bitcoin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path fill="#FFF" fill-rule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/></g></svg>`,

  // Social — gold circle, dark user silhouette (custom)
  Social: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#F5C800"/><circle cx="16" cy="12" r="4.5" fill="#0d0d0b" fill-opacity=".85"/><path fill="#0d0d0b" fill-opacity=".85" d="M7 26.5c0-5 4-8.5 9-8.5s9 3.5 9 8.5H7z"/></svg>`,
};

// ─── immersive canvas ─────────────────────────────────────────────────────────

// Canvas can't read CSS custom properties directly — ctx.fillStyle needs a
// resolved color string, not "var(--doc-accent)". These mirror the --doc-*
// tokens' dark/light values for exactly the strokes/fills this scene draws.
const SCENE_PALETTES: Record<
  Theme,
  {
    bgTint: string;
    grid: string;
    gridAlpha: number;
    particleGold: (a: number) => string;
    particleOther: (a: number) => string;
    ringTrack: string;
    glow: (i: number) => string;
    ringStroke: string;
    nodeLabel: (a: number) => string;
    nodeFallbackBg: string;
    logoGlow: string;
    logoFallbackBg: string;
    logoFallbackStroke: string;
    logoFallbackText: string;
  }
> = {
  dark: {
    bgTint: "rgba(30,24,5,0.4)",
    grid: "#F5C800",
    gridAlpha: 0.07,
    particleGold: (a) => `rgba(245,200,0,${a})`,
    particleOther: (a) => `rgba(255,255,255,${a * 0.4})`,
    ringTrack: "rgba(245,200,0,0.08)",
    glow: (i) => `rgba(245,200,0,${0.06 / i})`,
    ringStroke: "rgba(245,200,0,0.35)",
    nodeLabel: (a) => `rgba(255,255,255,${a})`,
    nodeFallbackBg: "#0d0d0b",
    logoGlow: "rgba(245,200,0,0.2)",
    logoFallbackBg: "#1a1505",
    logoFallbackStroke: "#F5C800",
    logoFallbackText: "#F5C800",
  },
  light: {
    bgTint: "rgba(184,148,10,0.10)",
    grid: "#B8940A",
    gridAlpha: 0.10,
    particleGold: (a) => `rgba(184,148,10,${a})`,
    particleOther: (a) => `rgba(26,25,20,${a * 0.35})`,
    ringTrack: "rgba(184,148,10,0.16)",
    glow: (i) => `rgba(184,148,10,${0.08 / i})`,
    ringStroke: "rgba(184,148,10,0.45)",
    nodeLabel: (a) => `rgba(26,25,20,${a})`,
    nodeFallbackBg: "#FFFFFF",
    logoGlow: "rgba(184,148,10,0.22)",
    logoFallbackBg: "#FBF4DC",
    logoFallbackStroke: "#B8940A",
    logoFallbackText: "#B8940A",
  },
};

function Scene({ mouse, theme }: { mouse: Vec2; theme: Theme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef<{
    particles: Particle[];
    time: number;
    raf: number;
    mouse: Vec2;
    images: Record<string, HTMLImageElement>;
    palette: (typeof SCENE_PALETTES)["dark"];
  }>({ particles: [], time: 0, raf: 0, mouse: { x: 0.5, y: 0.5 }, images: {}, palette: SCENE_PALETTES.dark });

  const NODES: ChainNode[] = [
    { label: "EVM", color: "#627EEA", angle: 0, dist: 200, phase: 0 },
    {
      label: "Solana",
      color: "#66F9A1",
      angle: (Math.PI * 2) / 5,
      dist: 200,
      phase: 1.3,
    },
    {
      label: "Tron",
      color: "#EF0027",
      angle: (Math.PI * 4) / 5,
      dist: 200,
      phase: 2.6,
    },
    {
      label: "Bitcoin",
      color: "#F7931A",
      angle: (Math.PI * 6) / 5,
      dist: 200,
      phase: 3.9,
    },
    {
      label: "Social",
      color: "#F5C800",
      angle: (Math.PI * 8) / 5,
      dist: 200,
      phase: 5.2,
    },
  ];

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const s = state.current;

    function setSize() {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    // Pre-load chain icon images + brand logo
    const allSvgs = { ...CHAIN_SVGS, __logo__: DECANE_LOGO_SVG };
    for (const [label, svg] of Object.entries(allSvgs)) {
      const img = new Image();
      img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      s.images[label] = img;
    }

    // seed particles
    s.particles = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00015,
      vy: (Math.random() - 0.5) * 0.00015,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.5 + 0.1,
      gold: Math.random() < 0.2,
    }));

    function draw(now: number) {
      s.time = now;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const cx = W / 2;
      const cy = H / 2;
      const tilt = { x: (s.mouse.x - 0.5) * 0.12, y: (s.mouse.y - 0.5) * 0.08 };

      ctx.clearRect(0, 0, W, H);

      // background radial
      const bg = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        Math.max(W, H) * 0.75,
      );
      bg.addColorStop(0, s.palette.bgTint);
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // perspective grid
      const horizon = cy * 0.55;
      const vp = { x: cx + tilt.x * W * 0.5, y: horizon };
      ctx.save();
      ctx.globalAlpha = s.palette.gridAlpha;
      ctx.strokeStyle = s.palette.grid;
      ctx.lineWidth = 0.8;
      const gridLines = 22;
      for (let i = 0; i <= gridLines; i++) {
        const t2 = i / gridLines;
        const sx = t2 * W;
        ctx.beginPath();
        ctx.moveTo(vp.x, vp.y);
        ctx.lineTo(sx, H);
        ctx.stroke();
      }
      const rows = 12;
      for (let r = 0; r <= rows; r++) {
        const yt = r / rows;
        const y = horizon + (H - horizon) * yt ** 2;
        const spread = yt ** 1.5 * W * 0.5;
        ctx.beginPath();
        ctx.moveTo(cx - spread, y);
        ctx.lineTo(cx + spread, y);
        ctx.stroke();
      }
      ctx.restore();

      // floating particles
      for (const p of s.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? s.palette.particleGold(p.a)
          : s.palette.particleOther(p.a);
        ctx.fill();
      }

      // central ring stack
      const ringR = Math.min(W, H) * 0.22;
      const spin = now * 0.0002;

      // outer orbit track
      ctx.beginPath();
      ctx.ellipse(
        cx,
        cy,
        ringR + 40,
        (ringR + 40) * 0.35,
        tilt.x,
        0,
        Math.PI * 2,
      );
      ctx.strokeStyle = s.palette.ringTrack;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // glow rings
      for (let i = 3; i > 0; i--) {
        const rr = ringR * (0.6 + i * 0.2);
        const g = ctx.createRadialGradient(cx, cy, rr * 0.6, cx, cy, rr * 1.3);
        g.addColorStop(0, s.palette.glow(i));
        g.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      // ring stroke
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.strokeStyle = s.palette.ringStroke;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // chain nodes orbiting
      for (const node of NODES) {
        const a = node.angle + spin + Math.sin(now * 0.001 + node.phase) * 0.15;
        const perspective = 1 + Math.sin(a + tilt.y * 2) * 0.25;
        const nx = cx + Math.cos(a) * (ringR + 38) * perspective;
        const ny = cy + Math.sin(a) * (ringR + 38) * 0.38 * perspective;
        const nodeR = 14 * perspective;
        const pulse = 0.85 + 0.15 * Math.sin(now * 0.002 + node.phase);

        // connection line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        const lineAlpha = 0.12 + 0.1 * Math.sin(now * 0.0015 + node.phase);
        ctx.strokeStyle = `${node.color}${Math.round(lineAlpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // data packet on line
        const pt = (now * 0.0008 + node.phase * 0.3) % 1;
        const px = cx + (nx - cx) * pt;
        const py2 = cy + (ny - cy) * pt;
        ctx.beginPath();
        ctx.arc(px, py2, 2 * perspective, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = 0.8 * (1 - Math.abs(pt - 0.5) * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // glow halo
        const halo = ctx.createRadialGradient(nx, ny, 0, nx, ny, nodeR * 2.5);
        halo.addColorStop(0, `${node.color}40`);
        halo.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(nx, ny, nodeR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // node: draw chain icon image clipped to circle
        const img = s.images[node.label];
        const r = nodeR * pulse;

        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, nx - r, ny - r, r * 2, r * 2);
          ctx.restore();
          // colour ring on top
          ctx.beginPath();
          ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.strokeStyle = node.color + "70";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          // fallback disc + initial
          ctx.beginPath();
          ctx.arc(nx, ny, r, 0, Math.PI * 2);
          ctx.fillStyle = s.palette.nodeFallbackBg;
          ctx.strokeStyle = node.color + "99";
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = node.color;
          ctx.font = `${nodeR * 1.0}px 'Geist Mono', monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label[0], nx, ny);
        }

        // label
        if (ny < cy || perspective > 1.1) {
          ctx.fillStyle = s.palette.nodeLabel(0.4 * perspective);
          ctx.font = `${10 * perspective}px 'Geist', system-ui`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label, nx, ny - r - 8);
        }
      }

      // Decane logo at centre
      const cr = 28;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 2.5);
      cg.addColorStop(0, s.palette.logoGlow);
      cg.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, cr * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = cg;
      ctx.fill();

      const logoImg = s.images["__logo__"];
      if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
        const lw = cr * 2.4;
        const lh = lw * (64 / 68);
        ctx.drawImage(logoImg, cx - lw / 2, cy - lh / 2, lw, lh);
      } else {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = s.palette.logoFallbackBg;
        ctx.strokeStyle = s.palette.logoFallbackStroke;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = s.palette.logoFallbackText;
        ctx.font = `800 ${cr}px 'Geist', system-ui`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("D", cx, cy + 1);
      }

      s.raf = requestAnimationFrame(draw);
    }

    s.raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    state.current.mouse = mouse;
  }, [mouse]);

  useEffect(() => {
    state.current.palette = SCENE_PALETTES[theme];
  }, [theme]);

  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

// ─── animated counter ─────────────────────────────────────────────────────────

function Counter({ to, label }: { to: number; label: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1200;
        const start = performance.now();
        function tick(now: number) {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - (1 - p) ** 3;
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 44,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          color: "var(--doc-accent)",
          lineHeight: 1,
          fontFamily: "'Geist', system-ui",
        }}
      >
        {val}
        <span style={{ fontSize: 28 }}>+</span>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--doc-text-muted)",
          marginTop: 4,
          fontFamily: "'Geist Mono', monospace",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ─── syntax highlighter ───────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function hlLine(line: string): string {
  if (!line.trim()) return " ";

  // Full-line comment
  const cm = line.match(/^(\s*)(\/\/.*)$/);
  if (cm) {
    return (
      cm[1] +
      `<span style="color:#636d83;font-style:italic">${escHtml(cm[2])}</span>`
    );
  }

  // Collect coloured fragments via placeholders so regexes never collide
  const parts: string[] = [];
  function ph(html: string): string {
    parts.push(html);
    return `\x01${parts.length - 1}\x01`;
  }

  let s = line;

  // 1. String literals first
  s = s.replace(/"[^"]*"/g, (m) =>
    ph(`<span style="color:#c3e88d">${escHtml(m)}</span>`),
  );

  // 2. JSX closing tag (includes trailing >)
  s = s.replace(/(<\/)([A-Z][A-Za-z0-9]*)(>)/g, (_, a, name, c) =>
    ph(
      `<span style="color:#89ddff">&lt;/</span><span style="color:#ffcb6b">${name}</span><span style="color:#89ddff">&gt;</span>`,
    ),
  );

  // 3. Self-closing />
  s = s.replace(/\/>/g, ph(`<span style="color:#89ddff">/&gt;</span>`));

  // 4. JSX opening <Tag
  s = s.replace(/(<)([A-Z][A-Za-z0-9]*)/g, (_, a, name) =>
    ph(
      `<span style="color:#89ddff">&lt;</span><span style="color:#ffcb6b">${name}</span>`,
    ),
  );

  // 5. '}}>  pattern — JSX attribute close
  s = s.replace(/\}\}>/g, ph(`<span style="color:#89ddff">}}&gt;</span>`));

  // 6. Standalone > at end of line (remaining JSX close)
  s = s.replace(
    />(\s*)$/,
    (_, trail) => ph(`<span style="color:#89ddff">&gt;</span>`) + trail,
  );

  // 7. Keywords
  s = s.replace(
    /\b(import|export|from|const|let|const|return|async|await|default)\b/g,
    (_, kw) => ph(`<span style="color:#c792ea">${kw}</span>`),
  );

  // 8. Prop / object key names we know about
  s = s.replace(/\b(mode|social|apiKey|config)\b(?=\s*[=:{])/g, (_, p) =>
    ph(`<span style="color:#a6dbfd">${p}</span>`),
  );

  // 9. SDK exports / components
  s = s.replace(
    /\b(DecaneKit|useSocialWallet|useDecane|useWalletSelector|App)\b/g,
    (_, id) => ph(`<span style="color:#82aaff">${id}</span>`),
  );

  // 10. Destructured identifiers
  s = s.replace(
    /\b(signMessage|sendTransaction|openModal|addresses|open|connectedWallet|disconnect|signInWithGoogle)\b/g,
    (_, id) => ph(`<span style="color:#89ddff">${id}</span>`),
  );

  // 11. Punctuation
  s = s.replace(/([{};,])/g, (m) =>
    ph(`<span style="color:#89ddff">${escHtml(m)}</span>`),
  );

  // Restore placeholders
  s = s.replace(/\x01(\d+)\x01/g, (_, i) => parts[Number(i)]);

  return s;
}

// ─── typing code block ────────────────────────────────────────────────────────

const WALLET_CODE = `import { DecaneKit, useDecane,
         useWalletSelector } from "decane-connect-kit";

<DecaneKit config={{ mode: "wallets" }}>
  <App />
</DecaneKit>

// Connect whatever's already installed
const { open } = useWalletSelector();
const { connectedWallet, disconnect } = useDecane();

<button onClick={open}>Connect Wallet</button>`;

const SOCIAL_CODE = `import { DecaneKit, useSocialWallet } from "decane-connect-kit";

<DecaneKit config={{
  mode: "social",
  social: { apiKey: "dck_live_…" },
}}>
  <App />
</DecaneKit>

// Same shape — no extension required
const { signInWithGoogle, addresses,
        signMessage, sendTransaction } = useSocialWallet();`;

function TypingCode({ code }: { code: string }) {
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function typeOut(text: string) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setShown(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 2;
      setShown(i);
      if (i >= text.length && intervalRef.current) clearInterval(intervalRef.current);
    }, 14);
  }

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setStarted(true);
        typeOut(code);
      },
      { threshold: 0.4 },
    );
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!started) return;
    typeOut(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const lines = code.slice(0, shown).split("\n");

  return (
    <div
      ref={ref}
      style={{
        background: "#0d0f14",
        border: "1px solid rgba(137,221,255,0.12)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.4), 0 24px 48px -16px rgba(0,0,0,0.7)",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          background: "#161921",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        {/* File tab */}
        <div
          style={{
            marginLeft: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#0d0f14",
            border: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid #0d0f14",
            borderRadius: "6px 6px 0 0",
            padding: "3px 12px 4px",
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <path
              d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"
              stroke="#82aaff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="13 2 13 9 20 9"
              stroke="#82aaff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          app.tsx
        </div>
      </div>

      {/* Top accent line */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(137,221,255,0.2), transparent)",
        }}
      />

      {/* Code lines */}
      <div style={{ padding: "14px 0 18px" }}>
        {lines.map((line, i) => {
          const isLast = i === lines.length - 1;
          const cursor = isLast
            ? `<span style="display:inline-block;width:2px;height:0.85em;background:#89ddff;margin-left:1px;animation:blink 1s steps(1) infinite;vertical-align:text-bottom"></span>`
            : "";
          return (
            <div
              key={i}
              style={{ display: "flex", lineHeight: 1.75, fontSize: 13 }}
            >
              {/* Line number */}
              <div
                style={{
                  width: 44,
                  paddingRight: 16,
                  textAlign: "right",
                  flexShrink: 0,
                  color: "var(--doc-text-muted)",
                  fontSize: 12,
                  userSelect: "none",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {i + 1}
              </div>
              {/* Code */}
              <div
                style={{
                  flex: 1,
                  paddingRight: 20,
                  color: "var(--doc-text)",
                  whiteSpace: "pre",
                }}
                dangerouslySetInnerHTML={{ __html: hlLine(line) + cursor }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── chain marquee ───────────────────────────────────────────────────────────

const MARQUEE_CHAINS = [
  { name: "Ethereum", slug: "ethereum" },
  {
    name: "Solana",
    svg: `data:image/svg+xml,${encodeURIComponent(CHAIN_SVGS.Solana)}`,
  },
  { name: "Base", slug: "base" },
  { name: "Arbitrum", slug: "arbitrum" },
  { name: "Optimism", slug: "optimism" },
  { name: "BNB Chain", slug: "bsc" },
  { name: "Polygon", slug: "polygon" },
  { name: "Avalanche", slug: "avax" },
  {
    name: "Bitcoin",
    svg: `data:image/svg+xml,${encodeURIComponent(CHAIN_SVGS.Bitcoin)}`,
  },
  {
    name: "Tron",
    svg: `data:image/svg+xml,${encodeURIComponent(CHAIN_SVGS.Tron)}`,
  },
  { name: "Blast", slug: "blast" },
  { name: "zkSync Era", slug: "zksync%20era" },
  { name: "Scroll", slug: "scroll" },
  { name: "Linea", slug: "linea" },
  { name: "Berachain", slug: "berachain" },
  { name: "Mantle", slug: "mantle" },
  { name: "Zora", slug: "zora" },
  { name: "Ronin", slug: "ronin" },
  { name: "Sei", slug: "sei" },
  { name: "Unichain", slug: "unichain" },
];

function ChainMarquee() {
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let a1: any = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let a2: any = null;

    import("gsap").then(({ gsap }) => {
      a1 = gsap.to(t1Ref.current, {
        xPercent: -50,
        duration: 32,
        ease: "none",
        repeat: -1,
      });
      a2 = gsap.fromTo(
        t2Ref.current,
        { xPercent: -50 },
        { xPercent: 0, duration: 38, ease: "none", repeat: -1 },
      );

      const el1 = t1Ref.current?.parentElement;
      const el2 = t2Ref.current?.parentElement;
      if (el1) {
        el1.addEventListener("mouseenter", () => a1?.pause());
        el1.addEventListener("mouseleave", () => a1?.resume());
      }
      if (el2) {
        el2.addEventListener("mouseenter", () => a2?.pause());
        el2.addEventListener("mouseleave", () => a2?.resume());
      }
    });

    return () => {
      a1?.kill();
      a2?.kill();
    };
  }, []);

  const item = (chain: (typeof MARQUEE_CHAINS)[0], i: number) => (
    <div
      key={i}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "0 24px",
        flexShrink: 0,
        color: "var(--doc-text-muted)",
        fontSize: 13,
        fontFamily: "'Geist', system-ui",
      }}
    >
      {chain.svg ? (
        <img
          src={chain.svg}
          width={18}
          height={18}
          style={{ borderRadius: 4, flexShrink: 0 }}
          alt=""
        />
      ) : (
        <img
          src={`https://icons.llamao.fi/icons/chains/rsz_${chain.slug}`}
          width={18}
          height={18}
          style={{ borderRadius: 4, flexShrink: 0 }}
          alt=""
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {chain.name}
      <span style={{ color: "color-mix(in oklab, var(--doc-accent) 25%, transparent)", marginLeft: 8 }}>◆</span>
    </div>
  );

  const row = (ref: React.RefObject<HTMLDivElement>) => (
    <div ref={ref} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
      {MARQUEE_CHAINS.map((c, i) => item(c, i))}
      {MARQUEE_CHAINS.map((c, i) => item(c, i + MARQUEE_CHAINS.length))}
    </div>
  );

  return (
    <div
      className="chain-marquee"
      style={{
        borderTop: "1px solid var(--doc-border)",
        borderBottom: "1px solid var(--doc-border)",
        overflow: "hidden",
        padding: "14px 0",
      }}
    >
      {/* row 1 — left */}
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          maskImage:
            "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        }}
      >
        {row(t1Ref)}
      </div>
      {/* row 2 — right */}
      <div
        style={{
          overflow: "hidden",
          marginTop: 10,
          position: "relative",
          maskImage:
            "linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)",
        }}
      >
        {row(t2Ref)}
      </div>
    </div>
  );
}

// ─── feature card with GSAP tilt ─────────────────────────────────────────────

function FeatureCard({
  f,
  FONT,
}: {
  f: { icon: React.ReactNode; title: string; desc: string };
  FONT: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let g: (typeof import("gsap"))["gsap"] | null = null;
    import("gsap").then(({ gsap }) => {
      g = gsap;
    });

    function onMove(e: MouseEvent) {
      if (!g) return;
  const r = el?.getBoundingClientRect();

  if (!r) return;

  const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
  const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
      g.to(el, {
        rotateY: x,
        rotateX: y,
        z: 20,
        duration: 0.35,
        ease: "power2.out",
        transformPerspective: 800,
      });
    }

    function onLeave() {
      if (!g) return;
      g.to(el, {
        rotateY: 0,
        rotateX: 0,
        z: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.55)",
      });
    }

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="feature-card"
      style={{
        background: "var(--doc-surface)",
        padding: "36px 32px",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: "color-mix(in oklab, var(--doc-accent) 8%, transparent)",
          border: "1px solid color-mix(in oklab, var(--doc-accent) 15%, transparent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--doc-accent)",
          marginBottom: 20,
        }}
      >
        {f.icon}
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 10,
          fontFamily: FONT,
          color: "var(--doc-text)",
        }}
      >
        {f.title}
      </div>
      <p
        style={{
          fontSize: 14,
          color: "var(--doc-text-muted)",
          lineHeight: 1.65,
          fontFamily: FONT,
        }}
      >
        {f.desc}
      </p>
    </div>
  );
}

// ─── shared type tokens ───────────────────────────────────────────────────────

const FONT = "'Geist', ui-sans-serif, system-ui, -apple-system, sans-serif";
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', monospace";

// ─── two-piece key glyph — the recurring security motif for social sign-in ────
// Not decorative: this literally represents the device-share / server-share
// split the security section explains.

function KeyHalf({
  side,
  joined,
  color = "var(--doc-accent)",
}: {
  side: "left" | "right";
  joined: boolean;
  color?: string;
}) {
  const flip = side === "left" ? 1 : -1;
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      style={{
        transform: `translateX(${joined ? 0 : flip * 22}px) rotate(${joined ? 0 : flip * -8}deg)`,
        transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <path
        d={
          side === "left"
            ? "M28 6a20 20 0 1 0 0 40 20 20 0 0 0 14.1-5.9L28 26V6z"
            : "M28 6v20l14.1 14.1A20 20 0 0 0 28 6z"
        }
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="26" r="4" fill={joined ? color : "transparent"} stroke={color} strokeWidth="2" />
    </svg>
  );
}

// ─── hero-style demo of the social sign-in moment ──────────────────────────────

type DemoStage = "idle" | "loading" | "revealed";

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function GoogleG() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.87c2.27-2.09 3.58-5.17 3.58-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.28v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.99-3.11Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.28 6.61l3.99 3.11C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}

function DemoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        fontSize: 12.5,
      }}
    >
      <span style={{ color: "var(--doc-text-muted)", fontFamily: MONO }}>{label}</span>
      <span style={{ color: "var(--doc-text-secondary)", fontFamily: MONO }}>{value}</span>
    </div>
  );
}

function SignInDemo() {
  const [stage, setStage] = useState<DemoStage>("idle");

  useEffect(() => {
    let mounted = true;
    async function loop() {
      while (mounted) {
        setStage("idle");
        await wait(1400);
        if (!mounted) return;
        setStage("loading");
        await wait(1100);
        if (!mounted) return;
        setStage("revealed");
        await wait(3200);
      }
    }
    loop();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div
      style={{
        width: "min(320px, 100%)",
        background: "var(--doc-surface)",
        border: "1px solid var(--doc-border)",
        borderRadius: 16,
        borderTop: "2px solid #F5C800",
        padding: 26,
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 11,
          color: "var(--doc-text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 18,
        }}
      >
        yourapp.com
      </div>

      {stage !== "revealed" ? (
        <div
          style={{
            height: 44,
            borderRadius: 10,
            border: "1px solid var(--doc-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "var(--doc-text)",
            background: "var(--doc-surface)",
            opacity: stage === "loading" ? 0.6 : 1,
            transition: "opacity 0.2s",
            fontFamily: FONT,
          }}
        >
          {stage === "loading" ? (
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid var(--doc-border)",
                borderTopColor: "var(--doc-accent)",
                animation: "dc-spin 0.7s linear infinite",
              }}
            />
          ) : (
            <GoogleG />
          )}
          {stage === "loading" ? "Signing in…" : "Continue with Google"}
        </div>
      ) : (
        <div
          style={{
            borderRadius: 10,
            border: "1px solid var(--doc-border)",
            background: "var(--doc-surface)",
            padding: 16,
            animation: "dc-reveal 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ display: "flex" }}>
              <KeyHalf side="left" joined color="var(--doc-success)" />
              <div style={{ marginLeft: -18, marginRight: -18 }} />
              <KeyHalf side="right" joined color="var(--doc-success)" />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--doc-success)", marginLeft: -8 }}>
              2-of-2 secured
            </span>
          </div>
          <DemoRow label="EVM" value="0x8f2A…c91E" />
          <DemoRow label="Solana" value="7xKX…RqW9" />
        </div>
      )}
    </div>
  );
}

// ─── main page ─────────────────────────────────────────────────────────────────

export default function Page() {
  const [mouse, setMouse] = useState<Vec2>({ x: 0.5, y: 0.5 });
  const [heroReady, setHeroReady] = useState(false);
  const [codeTab, setCodeTab] = useState<"wallet" | "social">("wallet");
  const [theme, toggleTheme] = useTheme();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const t = setTimeout(async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      setHeroReady(true);

      ctx = gsap.context(() => {
        // ── hero entrance ───────────────────────────────────────────────
        gsap.from(".hero-word", {
          y: 90,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.08,
          delay: 0.1,
        });
        gsap.from(".hero-sub", {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.55,
        });
        gsap.from(".hero-cta", {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.8,
        });
        gsap.from(".hero-stat", {
          y: 14,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          ease: "back.out(1.5)",
          stagger: 0.1,
          delay: 1.0,
        });
        gsap.from(".hero-badge-pill", {
          y: 16,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.08,
          delay: 1.3,
        });

        // ── hero parallax ───────────────────────────────────────────────
        gsap.to(heroRef.current, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // ── nav hide on scroll down, show on scroll up ──────────────────
        ScrollTrigger.create({
          start: "top -80",
          onUpdate: (self) => {
            if (self.direction === 1 && self.scroll() > 80) {
              gsap.to(".land-nav", {
                yPercent: -110,
                duration: 0.28,
                ease: "power3.in",
                overwrite: true,
              });
            } else {
              gsap.to(".land-nav", {
                yPercent: 0,
                duration: 0.4,
                ease: "power3.out",
                overwrite: true,
              });
            }
          },
        });

        // ── marquee fade in ─────────────────────────────────────────────
        gsap.from(".chain-marquee", {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".chain-marquee",
            start: "top 92%",
            once: true,
          },
        });

        // ── section label clip reveal ───────────────────────────────────
        gsap.utils.toArray<Element>(".section-label").forEach((el) => {
          gsap.from(el, {
            clipPath: "inset(0 100% 0 0)",
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // ── feature cards — stagger up ──────────────────────────────────
        gsap.from(".feature-card", {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: { each: 0.07, from: "start" },
          scrollTrigger: {
            trigger: ".feature-grid",
            start: "top 76%",
            once: true,
          },
        });

        // ── code section — columns from sides ───────────────────────────
        gsap.from(".code-col-left", {
          x: -56,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".code-section",
            start: "top 76%",
            once: true,
          },
        });
        gsap.from(".code-col-right", {
          x: 56,
          opacity: 0,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".code-section",
            start: "top 76%",
            once: true,
          },
        });

        // ── counter strip ───────────────────────────────────────────────
        gsap.from(".counter-item", {
          y: 30,
          opacity: 0,
          scale: 0.85,
          duration: 0.7,
          ease: "back.out(1.8)",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".counter-strip",
            start: "top 82%",
            once: true,
          },
        });

        // ── CTA entrance ────────────────────────────────────────────────
        gsap.from(".cta-inner", {
          y: 48,
          opacity: 0,
          scale: 0.96,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-inner",
            start: "top 82%",
            once: true,
          },
        });

        // ── generic .reveal-up fallback ─────────────────────────────────
        gsap.utils.toArray<Element>(".reveal-up").forEach((el) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });
    }, 100);
    return () => {
      clearTimeout(t);
      ctx?.revert();
    };
  }, []);

  const STATS = [
    { n: 58, label: "EVM chains" },
    { n: 12, label: "Solana wallets" },
    { n: 4, label: "Chain types" },
    { n: 30, label: "Min session" },
  ];

  const FEATURES = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      ),
      title: "Zero-config discovery",
      desc: "EIP-6963, Wallet Standard, TronLink, Unisat. All wallets detected the moment your dApp loads. window.ethereum never touched.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Non-custodial social wallet",
      desc: "Google or email sign-in creates a real on-chain wallet. XOR key split — device and server each hold half. Server never signs.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: "One API, four chains",
      desc: "signMessage, sendTransaction, signTypedData — identical hook API whether the user connects MetaMask, Phantom, TronLink, or their email.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "CAIP-25 session management",
      desc: "Multi-chain sessions out of the box. Grant permissions across EVM + Solana simultaneously. Revoke in one call.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
      ),
      title: "Gold & black UI, dark/light",
      desc: "Polished wallet selector and social sign-in modal included. Inject custom CSS tokens. Zero dependencies on CSS-in-JS.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: "TypeScript first",
      desc: "Full type declarations ship with the package. Every hook, every error code, every chain ID — autocomplete and safety out of the box.",
    },
  ];

  return (
    <div
      data-theme={theme}
      style={{
        background: "var(--doc-bg)",
        color: "var(--doc-text)",
        fontFamily: FONT,
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes blink { 50% { opacity: 0 } }
        @keyframes bounce { 0%,100% { transform: translateY(0) } 50% { transform: translateY(6px) } }
        @keyframes dc-spin { to { transform: rotate(360deg) } }
        @keyframes dc-reveal { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .hero-word { display: inline-block; will-change: transform; }
      `}</style>

      {/* ── NAV ── */}
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          overflow: "hidden",
        }}
      >
        <Scene mouse={mouse} theme={theme} />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {/* eyebrow */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "var(--doc-text-muted)",
              background: "var(--doc-surface)",
              border: "1px solid var(--doc-border)",
              borderRadius: 999,
              padding: "5px 16px",
              marginBottom: 32,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--doc-success)",
                boxShadow: "0 0 8px #12b76a",
              }}
            />
            v1.0.0 · stable · MIT
          </div>

          {/* headline */}
          <h1
            style={{
              fontSize: "clamp(52px, 9vw, 104px)",
              fontWeight: 900,
              letterSpacing: "-0.045em",
              lineHeight: 0.95,
              marginBottom: 28,
              fontFamily: FONT,
            }}
          >
            {["Connect", "a", "wallet."].map((w, i) => (
              <span
                key={i}
                className="hero-word"
                style={{
                  color: "var(--doc-text)",
                  marginRight: "0.25em",
                }}
              >
                {w}
              </span>
            ))}
            <br />
            {["Or", "create", "one."].map((w, i) => (
              <span
                key={i}
                className="hero-word"
                style={{
                  color: w === "create" ? "var(--doc-accent)" : "var(--doc-text-muted)",
                  fontStyle: w === "create" ? "italic" : "normal",
                  marginRight: "0.25em",
                }}
              >
                {w}
              </span>
            ))}
          </h1>

          {/* sub */}
          <p
            className="hero-sub"
            style={{
              fontSize: "clamp(15px, 2vw, 19px)",
              color: "var(--doc-text-muted)",
              lineHeight: 1.65,
              maxWidth: "56ch",
              margin: "0 auto 44px",
              fontFamily: FONT,
            }}
          >
            EVM, Solana, Tron, Bitcoin — connect whatever&rsquo;s already
            installed. Nothing installed? Google or email sign-in spins up a
            real non-custodial wallet in seconds. Same hooks, same session,
            either way.
          </p>

          {/* CTAs */}
          <div
            className="hero-cta"
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 56,
            }}
          >
            <Link
              href="/docs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 52,
                padding: "0 32px",
                background: "var(--doc-accent)",
                color: "var(--doc-accent-text)",
                fontWeight: 800,
                fontSize: 15,
                borderRadius: 12,
                boxShadow: "0 0 40px color-mix(in oklab, var(--doc-accent) 35%, transparent)",
                transition: "all 0.15s",
                fontFamily: FONT,
              }}
            >
              Get started
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://www.npmjs.com/package/decane-connect-kit"
              target="_blank"
              rel="noreferrer"
              title="View on npm"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 52,
                padding: "0 24px",
                background: "var(--doc-surface)",
                color: "var(--doc-text-secondary)",
                border: "1px solid var(--doc-border)",
                fontSize: 14,
                borderRadius: 12,
                fontFamily: MONO,
                letterSpacing: "-0.01em",
              }}
            >
              <span style={{ color: "var(--doc-text-muted)" }}>$</span>&nbsp;npm
              i decane-connect-kit
            </a>
          </div>

          {/* chain type badge pills */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 44,
            }}
          >
            {[
              { label: "EVM · 58 chains", color: "#627EEA" },
              { label: "Solana · Wallet Standard", color: "#66F9A1" },
              { label: "Tron · TronLink", color: "#EF0027" },
              { label: "Bitcoin · Unisat", color: "#F7931A" },
              { label: "Social · Google & email", color: "var(--doc-accent)" },
            ].map((b) => (
              <div
                key={b.label}
                className="hero-badge-pill"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  height: 30,
                  padding: "0 14px",
                  background: "var(--doc-surface)",
                  border: `1px solid ${b.color}30`,
                  borderRadius: 999,
                  fontSize: 12,
                  fontFamily: MONO,
                  color: "var(--doc-text-muted)",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: b.color,
                    flexShrink: 0,
                  }}
                />
                {b.label}
              </div>
            ))}
          </div>

          {/* stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {STATS.map((s) => (
              <div
                key={s.label}
                className="hero-stat"
                style={{ textAlign: "center" }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "var(--doc-accent)",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                    fontFamily: FONT,
                  }}
                >
                  {s.n}+
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--doc-text-muted)",
                    fontFamily: MONO,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginTop: 4,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--doc-text-muted)",
            fontSize: 11,
            fontFamily: MONO,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "bounce 2s ease-in-out infinite",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          scroll
        </div>
      </section>

      {/* ── CHAIN MARQUEE ── */}
      <ChainMarquee />

      {/* ── FEATURES ── */}
      <section
        style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}
      >
        <div
          className="reveal-up"
          style={{ textAlign: "center", marginBottom: 64 }}
        >
          <div
            className="section-label"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "var(--doc-accent)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            What&rsquo;s inside
          </div>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              fontFamily: FONT,
            }}
          >
            Everything you need.
            <br />
            <span style={{ color: "var(--doc-text-muted)" }}>
              Nothing you don&rsquo;t.
            </span>
          </h2>
        </div>
        <div
          className="feature-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 1,
            background: "var(--doc-border)",
            border: "1px solid var(--doc-border)",
            borderRadius: 16,
            overflow: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} f={f} FONT={FONT} />
          ))}
        </div>
      </section>

      {/* ── SOCIAL: THE MECHANISM ── */}
      <section
        id="social"
        style={{ padding: "0 24px 100px", maxWidth: 1160, margin: "0 auto" }}
      >
        <div
          className="social-mechanism-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 56,
            alignItems: "center",
            marginBottom: 72,
          }}
        >
          <div className="reveal-up">
            <div
              className="section-label"
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: "var(--doc-accent)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              No wallet? No problem.
            </div>
            <h2
              style={{
                fontSize: "clamp(30px, 4.4vw, 46px)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                marginBottom: 20,
                fontFamily: FONT,
                maxWidth: "16ch",
              }}
            >
              Turn a login into a{" "}
              <span style={{ color: "var(--doc-accent)", fontStyle: "italic" }}>wallet.</span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--doc-text-muted)",
                lineHeight: 1.65,
                maxWidth: "48ch",
              }}
            >
              Google or email sign-in creates a real EVM and Solana wallet —
              no extension, no seed phrase, nothing for your user to lose.
              The private key is never assembled in one place: the user&rsquo;s
              device holds half, decane holds the other.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <SignInDemo />
          </div>
        </div>

        <div
          className="reveal-up social-steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--doc-border)",
            border: "1px solid var(--doc-border)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[
            {
              n: "01",
              title: "They sign in",
              desc: "Google or email — the flow your users already know. Nothing about it looks or feels like crypto.",
            },
            {
              n: "02",
              title: "A key is generated, then split",
              desc: "A fresh private key is created and immediately XOR-split into two halves. Neither half is the key.",
            },
            {
              n: "03",
              title: "Wallet is ready",
              desc: "Their device keeps one half, wrapped by a passkey or PIN. decane stores the other, encrypted. Both are needed to sign.",
            },
          ].map((s) => (
            <div key={s.n} style={{ background: "var(--doc-surface)", padding: "32px 28px" }}>
              <div style={{ fontFamily: MONO, fontSize: 13, color: "var(--doc-text-muted)", marginBottom: 16 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, letterSpacing: "-0.01em", fontFamily: FONT }}>
                {s.title}
              </div>
              <p style={{ fontSize: 13.5, color: "var(--doc-text-muted)", lineHeight: 1.65, fontFamily: FONT }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL: SECURITY — two-halves motif ── */}
      <section style={{ padding: "0 24px 120px" }}>
        <div
          className="reveal-up social-security-card"
          style={{
            maxWidth: 980,
            margin: "0 auto",
            background: "radial-gradient(ellipse at 50% 0%, color-mix(in oklab, var(--doc-accent) 5%, transparent), transparent 70%)",
            border: "1px solid var(--doc-border)",
            borderRadius: 20,
            padding: "64px 48px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ display: "flex" }}>
              <KeyHalf side="left" joined={false} />
              <div style={{ marginLeft: -18, marginRight: -18 }} />
              <KeyHalf side="right" joined={false} />
            </div>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "var(--doc-accent)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            Nobody holds the whole key
          </div>
          <h2
            style={{
              fontSize: "clamp(26px, 3.4vw, 36px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              maxWidth: "22ch",
              margin: "0 auto 20px",
              fontFamily: FONT,
            }}
          >
            Not the user&rsquo;s device alone. Not decane&rsquo;s servers alone.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--doc-text-muted)",
              lineHeight: 1.7,
              maxWidth: "56ch",
              margin: "0 auto 32px",
              fontFamily: FONT,
            }}
          >
            The key only ever comes together for the length of a single
            signature, and even then, only inside the SDK on the device
            that&rsquo;s signing. If decane&rsquo;s database were breached, the
            stolen half is useless without the device half. If a device were
            lost, that half is useless without a valid, authenticated
            session.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 12,
              color: "color-mix(in oklab, var(--doc-success) 90%, transparent)",
              background: "color-mix(in oklab, var(--doc-success) 8%, transparent)",
              border: "1px solid color-mix(in oklab, var(--doc-success) 25%, transparent)",
              borderRadius: 999,
              padding: "6px 16px",
              marginRight: 10,
            }}
          >
            Encrypted at rest today
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 12,
              color: "color-mix(in oklab, var(--doc-accent) 90%, transparent)",
              background: "color-mix(in oklab, var(--doc-accent) 8%, transparent)",
              border: "1px solid color-mix(in oklab, var(--doc-accent) 25%, transparent)",
              borderRadius: 999,
              padding: "6px 16px",
            }}
          >
            In progress — signing moving into a hardware-isolated enclave (TEE)
          </div>
        </div>
      </section>

      {/* ── CODE + STATS ── */}
      <section
        className="code-section"
        style={{
          padding: "40px 24px 120px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        <div className="code-col-left">
          <div
            className="section-label"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: "var(--doc-accent)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Integration
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 20,
              fontFamily: FONT,
            }}
          >
            One SDK.
            <br />
            <span style={{ color: "var(--doc-text-muted)" }}>Both paths.</span>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--doc-text-muted)",
              lineHeight: 1.65,
              marginBottom: 32,
              fontFamily: FONT,
            }}
          >
            Wrap your app with{" "}
            <code
              style={{
                background: "color-mix(in oklab, var(--doc-accent) 10%, transparent)",
                padding: "1px 6px",
                borderRadius: 4,
                fontFamily: MONO,
                fontSize: 13,
                color: "var(--doc-accent)",
              }}
            >
              DecaneKit
            </code>
            . Whether a user connects an existing wallet or signs in with
            Google, the hooks on your side look the same — discovery,
            sessions, and key management are handled either way.
          </p>
          <Link
            href="/docs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 42,
              padding: "0 20px",
              background: "color-mix(in oklab, var(--doc-accent) 10%, transparent)",
              color: "var(--doc-accent)",
              border: "1px solid color-mix(in oklab, var(--doc-accent) 25%, transparent)",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: FONT,
            }}
          >
            Read the docs →
          </Link>
        </div>
        <div className="code-col-right">
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {(
              [
                { key: "wallet", label: "Connect a wallet" },
                { key: "social", label: "Sign in with Google" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setCodeTab(t.key)}
                style={{
                  height: 34,
                  padding: "0 16px",
                  borderRadius: 8,
                  border: `1px solid ${codeTab === t.key ? "color-mix(in oklab, var(--doc-accent) 35%, transparent)" : "var(--doc-border)"}`,
                  background: codeTab === t.key ? "color-mix(in oklab, var(--doc-accent) 10%, transparent)" : "var(--doc-surface)",
                  color: codeTab === t.key ? "var(--doc-accent)" : "var(--doc-text-muted)",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: FONT,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <TypingCode code={codeTab === "wallet" ? WALLET_CODE : SOCIAL_CODE} />
        </div>
      </section>

      {/* ── COUNTER STRIP ── */}
      <div
        className="counter-strip"
        style={{
          borderTop: "1px solid var(--doc-border)",
          borderBottom: "1px solid var(--doc-border)",
          padding: "60px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 40,
          }}
        >
          {[
            { to: 58, label: "EVM chains" },
            { to: 12, label: "Solana wallets" },
            { to: 4, label: "Chain types" },
            { to: 30, label: "Min session" },
          ].map((c) => (
            <div key={c.label} className="counter-item">
              <Counter to={c.to} label={c.label} />
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: "120px 24px", textAlign: "center" }}>
        <div
          className="cta-inner"
          style={{
            display: "inline-block",
            background:
              "radial-gradient(ellipse at center, color-mix(in oklab, var(--doc-accent) 6%, transparent) 0%, transparent 70%)",
            padding: "80px 60px",
            borderRadius: 24,
            border: "1px solid color-mix(in oklab, var(--doc-accent) 10%, transparent)",
            maxWidth: 680,
          }}
        >
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 16,
              fontFamily: FONT,
            }}
          >
            Ready to ship?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "var(--doc-text-muted)",
              marginBottom: 40,
              lineHeight: 1.6,
              fontFamily: FONT,
            }}
          >
            Install the package, wrap your app, connect. Under 60 seconds to
            your first signed message — with or without an installed wallet.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/docs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: 52,
                padding: "0 36px",
                background: "var(--doc-accent)",
                color: "var(--doc-accent-text)",
                fontWeight: 800,
                fontSize: 16,
                borderRadius: 12,
                boxShadow: "0 0 60px color-mix(in oklab, var(--doc-accent) 30%, transparent)",
                fontFamily: FONT,
              }}
            >
              Get started
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href={`${DASHBOARD_URL}/auth/register`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 52,
                padding: "0 32px",
                background: "var(--doc-surface)",
                color: "var(--doc-text-secondary)",
                border: "1px solid var(--doc-border)",
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: FONT,
              }}
            >
              Get a social sign-in API key
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
