"use client";
import { useEffect, useRef } from "react";

// Behind the landing page: one field of points that tells Decane's story as
// you scroll. A world of users ringed by three chains in the hero; a key in
// three shares, two of them joined, for the flow; a shield for what you get;
// a drop of gas with a coin orbiting it, paid for, for gas sponsorship; a
// `</>` for the integration; rays round the closing call to action. Point k
// is the same point in every shape, so the points fly from one to the next.
// The cursor pushes points aside and a click on blank page sends a ripple.
// three.js loads after first paint; reduced motion or no WebGL2 leaves the
// page exactly as it was without it.

const mulberry = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const gauss = (r: () => number) => (r() + r() + r() - 1.5) / 1.5;

type Out = { p: Float32Array; t: Float32Array };
type Shape = (n: number, r: () => number, o: Out) => void;

function set(o: Out, k: number, x: number, y: number, z: number, t = 0) {
  o.p[k * 3] = x;
  o.p[k * 3 + 1] = y;
  o.p[k * 3 + 2] = z;
  o.t[k] = t;
}

/** A world of users, ringed by three chain orbits (Ethereum, Solana, Tron). */
const world: Shape = (n, r, o) => {
  const tilts = [
    [0.35, 0.0],
    [-0.5, 0.9],
    [0.15, -1.1],
  ];
  for (let k = 0; k < n; k++) {
    if (r() < 0.34) {
      // the world: a soft sphere of people, low, behind the buttons rather
      // than behind the lede
      const y = 1 - 2 * r();
      const rr = Math.sqrt(1 - y * y);
      const a = r() * Math.PI * 2;
      const R = 1.7 + gauss(r) * 0.05;
      set(o, k, Math.cos(a) * rr * R, y * R - 1.7, Math.sin(a) * rr * R, r() < 0.06 ? 0.9 : 0);
    } else {
      // a chain's orbit, wide enough to frame the headline
      const ring = k % 3;
      const [tx, ty] = tilts[ring];
      const a = r() * Math.PI * 2;
      const R = 5.6 + ring * 0.8 + gauss(r) * 0.06;
      let x = Math.cos(a) * R * 1.25;
      let y = 0;
      let z = Math.sin(a) * R;
      // tilt the ring
      const y1 = y * Math.cos(tx) - z * Math.sin(tx);
      z = y * Math.sin(tx) + z * Math.cos(tx);
      y = y1;
      const x1 = x * Math.cos(ty) + z * Math.sin(ty);
      z = -x * Math.sin(ty) + z * Math.cos(ty);
      x = x1;
      set(o, k, x, y * 0.55, z, a % 0.9 < 0.08 ? 1 : 0.35);
    }
  }
};

/** A key in three shares: three clusters, two of them joined (any two open the wallet). */
const shares: Shape = (n, r, o) => {
  const C = [
    [-3.4, -1.2, 0],
    [3.4, -1.2, 0],
    [0, 2.4, 0],
  ];
  for (let k = 0; k < n; k++) {
    const pick = r();
    if (pick < 0.66) {
      const c = C[k % 3];
      const y = 1 - 2 * r();
      const rr = Math.sqrt(1 - y * y);
      const a = r() * Math.PI * 2;
      const R = 1.25 * Math.cbrt(r());
      set(o, k, c[0] + Math.cos(a) * rr * R, c[1] + y * R, c[2] + Math.sin(a) * rr * R, k % 3 === 2 ? 0.15 : 0.9);
    } else {
      // the strand between the two shares that open it
      const t = r();
      const x = lerp(C[0][0], C[1][0], t);
      const y = C[0][1] + Math.sin(t * Math.PI) * -0.5 + gauss(r) * 0.05;
      const z = Math.sin(t * Math.PI * 3) * 0.25 + gauss(r) * 0.05;
      set(o, k, x, y, z, 1);
    }
  }
};

/** A shield with a check: nobody can spend it but them. */
const shield: Shape = (n, r, o) => {
  // the outline of a shield, as a function of v in [-1, 1] (top to bottom)
  const half = (v: number) => (v < 0.15 ? 2.5 : 2.5 * Math.cos(((v - 0.15) / 0.85) * (Math.PI / 2)));
  for (let k = 0; k < n; k++) {
    const pick = r();
    if (pick < 0.55) {
      // the face, slightly domed
      const v = r() * 2 - 1;
      const u = (r() * 2 - 1) * half(v);
      const y = 2.9 - (v + 1) * 2.9;
      set(o, k, u, y, 0.6 * (1 - (u / 2.6) ** 2) + gauss(r) * 0.04, 0);
    } else if (pick < 0.8) {
      // the rim
      const v = r() * 2 - 1;
      const side = r() < 0.5 ? -1 : 1;
      const y = 2.9 - (v + 1) * 2.9;
      set(o, k, side * half(v) + gauss(r) * 0.04, y, gauss(r) * 0.08, 0.35);
    } else {
      // the check mark, lit, standing off the face
      const t = r();
      const [x, y] = t < 0.35 ? [lerp(-1.2, -0.3, t / 0.35), lerp(0.2, -0.8, t / 0.35)] : [lerp(-0.3, 1.4, (t - 0.35) / 0.65), lerp(-0.8, 1.2, (t - 0.35) / 0.65)];
      set(o, k, x + gauss(r) * 0.07, y + gauss(r) * 0.07, 0.75, 1);
    }
  }
};

/** A drop of gas, and a coin orbiting it: the project pays. */
const gas: Shape = (n, r, o) => {
  for (let k = 0; k < n; k++) {
    if (r() < 0.7) {
      // a teardrop surface, point at the top
      const t = Math.acos(1 - 2 * r()); // 0 top … π bottom
      const a = r() * Math.PI * 2;
      const R = 2.2 * Math.sin(t) * Math.pow(Math.sin(t / 2), 1.2);
      const y = 3.0 * Math.cos(t) * 0.95 - 0.3;
      set(o, k, Math.cos(a) * R, y, Math.sin(a) * R, t > 2.4 ? 0.5 : 0);
    } else {
      // the coin's path, lit, tilted round the drop
      const a = r() * Math.PI * 2;
      const R = 3.6 + gauss(r) * 0.08;
      const x = Math.cos(a) * R;
      const z = Math.sin(a) * R;
      set(o, k, x, -0.6 + z * 0.28 + gauss(r) * 0.04, z, 1);
    }
  }
};

/** `</>`: the integration. */
const code: Shape = (n, r, o) => {
  const strokes: number[][] = [
    // [x1, y1, x2, y2, tint]
    [-2.2, 1.9, -4.2, 0, 0.3],
    [-4.2, 0, -2.2, -1.9, 0.3],
    [1.0, 2.4, -1.0, -2.4, 1],
    [2.2, 1.9, 4.2, 0, 0.3],
    [4.2, 0, 2.2, -1.9, 0.3],
  ];
  const len = strokes.map((s) => Math.hypot(s[2] - s[0], s[3] - s[1]));
  const total = len.reduce((a, b) => a + b, 0);
  for (let k = 0; k < n; k++) {
    let pick = r() * total;
    let s = 0;
    while (pick > len[s] && s < strokes.length - 1) pick -= len[s++];
    const [x1, y1, x2, y2, tint] = strokes[s];
    const t = r();
    set(o, k, lerp(x1, x2, t) + gauss(r) * 0.16, lerp(y1, y2, t) + gauss(r) * 0.16, gauss(r) * 0.35, tint);
  }
};

/** Rays round the closing call to action. */
const rays: Shape = (n, r, o) => {
  const R = 64;
  for (let k = 0; k < n; k++) {
    const ray = k % R;
    const a = (ray / R) * Math.PI * 2 + gauss(r) * 0.012;
    const d = 4.4 + Math.pow(r(), 1.6) * 6;
    set(o, k, Math.cos(a) * d * 1.35, Math.sin(a) * d * 0.8, gauss(r) * 0.3, ray % 4 === 0 ? 1 : 0.2);
  }
};

const SCENES: {
  sel: string;
  shape: Shape;
  x: number;
  alpha: number;
  spin: number;
  hue: [dark: string, light: string];
}[] = [
  { sel: ".hero", shape: world, x: 0, alpha: 0.7, spin: 0.35, hue: ["#f0c45a", "#a8741a"] },
  { sel: "#how", shape: shares, x: 0, alpha: 0.55, spin: 0.25, hue: ["#ffb86b", "#b5651d"] },
  { sel: "#features", shape: shield, x: 0, alpha: 0.5, spin: 0.3, hue: ["#8fd6a8", "#2f8a55"] },
  { sel: "#gas", shape: gas, x: 0, alpha: 0.6, spin: 0.3, hue: ["#ffd36e", "#b07d12"] },
  { sel: "#integrate", shape: code, x: 0, alpha: 0.45, spin: 0, hue: ["#9ec5ff", "#2f5bd8"] },
  { sel: "#start", shape: rays, x: 0, alpha: 0.8, spin: 0, hue: ["#f0c45a", "#a8741a"] },
];

export function WalletField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop = () => {};
    let cancelled = false;

    void import("three").then((THREE) => {
      if (cancelled) return;
      const narrow = innerWidth <= 640;
      const touch = matchMedia("(hover: none)").matches;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        // three r163+ is WebGL2-only and throws here without it; there is no
        // capabilities.isWebGL2 to check any more (it reads undefined).
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio, narrow ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      el.append(renderer.domElement);

      // Every shape into one texture, a block of rows per scene.
      const n = narrow ? 9000 : 18000;
      const S = SCENES.length;
      const TW = 256;
      const rows = Math.ceil(n / TW);
      const data = new Float32Array(TW * rows * S * 4);
      const out: Out = { p: new Float32Array(n * 3), t: new Float32Array(n) };
      SCENES.forEach((sc, s) => {
        sc.shape(n, mulberry(11 + s), out);
        for (let k = 0; k < n; k++) {
          const i = (s * TW * rows + k) * 4;
          data[i] = out.p[k * 3];
          data[i + 1] = out.p[k * 3 + 1];
          data[i + 2] = out.p[k * 3 + 2];
          data[i + 3] = out.t[k];
        }
      });
      const tex = new THREE.DataTexture(data, TW, rows * S, THREE.RGBAFormat, THREE.FloatType);
      tex.needsUpdate = true;

      const ids = new Float32Array(n);
      const seed = new Float32Array(n);
      const r = mulberry(3);
      for (let k = 0; k < n; k++) {
        ids[k] = k;
        seed[k] = r();
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geo.setAttribute("aId", new THREE.BufferAttribute(ids, 1));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

      const uniforms = {
        uPos: { value: tex },
        uRows: { value: rows },
        uTime: { value: 0 },
        uStage: { value: 0 },
        uAlpha: { value: 0 },
        uWarp: { value: 0 },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uRipple: { value: new THREE.Vector3(0, 0, -10) },
        uDrag: { value: new THREE.Vector2(0, 0) },
        uSway: { value: 0 },
        uLastY: { value: 0 },
        uOffK: { value: 1 },
        uAspect: { value: 1 },
        uScale: { value: 1 },
        uPx: { value: renderer.getPixelRatio() },
        uOffX: { value: SCENES.map((s) => s.x) },
        uSpin: { value: SCENES.map((s) => s.spin) },
        uInk: { value: new THREE.Color() },
        uAccent: { value: new THREE.Color() },
        uDark: { value: 0 },
      };

      const mat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        vertexShader: /* glsl */ `
          attribute float aId;
          attribute float aSeed;
          uniform sampler2D uPos;
          uniform float uRows, uTime, uStage, uWarp, uAspect, uScale, uPx;
          uniform float uOffX[${S}];
          uniform float uSpin[${S}];
          uniform vec2 uMouse;
          uniform vec3 uRipple;
          uniform vec2 uDrag;
          uniform float uSway, uOffK, uLastY;
          varying float vBright;
          varying float vTint;

          vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
          vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }

          vec4 shape(int s) {
            int id = int(aId);
            vec4 v = texelFetch(uPos, ivec2(id % 256, id / 256 + s * int(uRows)), 0);
            vec3 p = v.xyz;
            float spin = uSpin[s];
            if (s == 0) {
              // the world turns; its rings turn the other way, faster
              p = length(p - vec3(0.0, -1.7, 0.0)) < 2.5 ? rotY(p, uTime * 0.08) : rotY(p, -uTime * 0.05);
            } else if (s == 3) {
              // the drop bobs; the coin runs round it
              if (v.w > 0.9) p = rotY(p, uTime * 0.6);
              else p.y += sin(uTime * 1.2) * 0.12;
              p = rotY(p, sin(uTime * 0.3) * 0.25);
            } else if (s == ${S - 1}) {
              float d = length(p.xy);
              p.xy *= 1.0 + 0.06 * sin(uTime * 1.4 - d * 0.6);
              // Centred on the call to action wherever it sits on screen, not
              // on the window: at the bottom the footer pushes it up.
              p.y += uLastY;
            } else {
              p = rotY(p, uTime * 0.1 * spin + sin(uTime * 0.25) * 0.18 * step(spin, 0.01));
            }
            if (s != ${S - 1}) {
              p = rotX(rotY(p, uDrag.x), uDrag.y);
              p = rotY(p, uSway);
            }
            p.x += uOffX[s] * uScale * uOffK;
            return vec4(p, v.w);
          }

          void main() {
            float last = float(${S - 1});
            float st = clamp(uStage, 0.0, last);
            int a = int(floor(min(st, last - 0.001)));
            float f = st - float(a);
            float t = smoothstep(0.0, 1.0, clamp((f - aSeed * 0.4) / 0.6, 0.0, 1.0));
            vec4 A = shape(a);
            vec4 B = shape(min(a + 1, ${S - 1}));
            vec3 p = mix(A.xyz, B.xyz, t);
            float tint = mix(A.w, B.w, t);
            p += vec3(sin(aSeed * 40.0), cos(aSeed * 31.0), sin(aSeed * 17.0)) * sin(t * 3.14159) * 1.0;
            p.z += (aSeed - 0.5) * uWarp * 6.0;
            p *= uScale;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vec4 clip = projectionMatrix * mv;
            vec2 ndc = clip.xy / clip.w;
            vec2 d = (ndc - uMouse) * vec2(uAspect, 1.0);
            float near = smoothstep(0.3, 0.0, length(d));
            ndc += normalize(d + 1e-5) / vec2(uAspect, 1.0) * near * 0.06;
            float age = uTime - uRipple.z;
            vec2 rd = (ndc - uRipple.xy) * vec2(uAspect, 1.0);
            float ring = exp(-pow((length(rd) - age * 1.4) * 9.0, 2.0)) * exp(-age * 1.6);
            ndc += normalize(rd + 1e-5) / vec2(uAspect, 1.0) * ring * 0.05;
            clip.xy = ndc * clip.w;
            gl_Position = clip;

            vBright = 0.55 + aSeed * 0.45 + near * 1.2 + ring * 1.8;
            vTint = clamp(tint + near * 0.6 + ring, 0.0, 1.0);
            gl_PointSize = (1.3 + aSeed * 1.6 + tint * 1.2 + near * 1.6) * uPx * (11.0 / -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uAlpha, uDark;
          uniform vec3 uInk, uAccent;
          varying float vBright;
          varying float vTint;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            vec3 col = mix(uInk, uAccent, vTint);
            if (uDark > 0.5) {
              float g = smoothstep(0.5, 0.0, d);
              float i = g * g * vBright * uAlpha * 1.5;
              gl_FragColor = vec4(col * i, i);
            } else {
              float g = smoothstep(0.5, 0.3, d);
              float a = g * min(1.0, vBright * 0.75) * uAlpha * 0.6;
              gl_FragColor = vec4(col * a, a);
            }
          }
        `,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      const scene = new THREE.Scene();
      scene.add(points);
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

      // The site's theme lives on the .site wrapper, not on <html>.
      const site = el.closest<HTMLElement>(".site");
      const theme = () => {
        const dark = (site?.dataset.theme ?? "dark") !== "light";
        uniforms.uDark.value = dark ? 1 : 0;
        uniforms.uInk.value.set(dark ? "#f1eee7" : "#1b1a17");
        mat.blending = dark ? THREE.CustomBlending : THREE.NormalBlending;
        mat.blendSrc = THREE.OneFactor;
        mat.blendDst = dark ? THREE.OneFactor : THREE.OneMinusSrcAlphaFactor;
        mat.blendSrcAlpha = THREE.OneFactor;
        mat.blendDstAlpha = dark ? THREE.OneFactor : THREE.OneMinusSrcAlphaFactor;
        mat.premultipliedAlpha = true;
        mat.needsUpdate = true;
      };
      theme();
      const hues = SCENES.map((sc) => sc.hue.map((h) => new THREE.Color(h)));
      const hueNow = new THREE.Color();
      const mo = new MutationObserver(theme);
      if (site) mo.observe(site, { attributes: true, attributeFilter: ["data-theme"] });

      // Scroll: which scene the page is in.
      const marks = SCENES.map((s, i) => ({ el: document.querySelector<HTMLElement>(s.sel), i, alpha: s.alpha })).filter(
        (m): m is { el: HTMLElement; i: number; alpha: number } => !!m.el,
      );
      const place = () => {
        const mid = innerHeight / 2;
        const ys = marks.map((m) => {
          const b = m.el.getBoundingClientRect();
          return b.top + Math.min(b.height, innerHeight) / 2 - mid;
        });
        if (ys[0] >= 0) return { stage: marks[0].i, alpha: marks[0].alpha };
        for (let j = 0; j < marks.length - 1; j++) {
          if (ys[j + 1] > 0) {
            const f = clamp(-ys[j] / (ys[j + 1] - ys[j]), 0, 1);
            const g = smooth(clamp((f - 0.2) / 0.6, 0, 1));
            return { stage: lerp(marks[j].i, marks[j + 1].i, g), alpha: lerp(marks[j].alpha, marks[j + 1].alpha, g) };
          }
        }
        const last = marks[marks.length - 1];
        return { stage: last.i, alpha: last.alpha };
      };
      const target = () => {
        const t = place();
        // The closing section can't reach mid-screen: finish it over the last stretch.
        const rem = document.documentElement.scrollHeight - innerHeight - scrollY;
        const end = clamp(1 - rem / (innerHeight * 0.6), 0, 1);
        const last = marks[marks.length - 1];
        return { stage: lerp(t.stage, last.i, end), alpha: lerp(t.alpha, last.alpha, end) };
      };

      // Input.
      const mouse = { x: 9, y: 9, tx: 9, ty: 9 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / innerWidth) * 2 - 1;
        mouse.ty = -(e.clientY / innerHeight) * 2 + 1;
        if (mouse.x > 5) [mouse.x, mouse.y] = [mouse.tx, mouse.ty];
      };
      const onLeave = () => ([mouse.tx, mouse.ty] = [9, 9]);
      let lift = 0;
      const onTouch = (e: TouchEvent) => {
        const t = e.touches[0];
        if (!t) return;
        clearTimeout(lift);
        mouse.tx = (t.clientX / innerWidth) * 2 - 1;
        mouse.ty = -(t.clientY / innerHeight) * 2 + 1;
        if (mouse.x > 5) [mouse.x, mouse.y] = [mouse.tx, mouse.ty];
      };
      const onTouchEnd = () => {
        lift = window.setTimeout(onLeave, 500);
      };
      if (touch) {
        addEventListener("touchstart", onTouch, { passive: true });
        addEventListener("touchmove", onTouch, { passive: true });
        addEventListener("touchend", onTouchEnd, { passive: true });
      }
      // Blank page only: never a control, text, demo or the nav.
      const blank = (t: EventTarget | null) =>
        t instanceof Element &&
        !t.closest(
          "a, button, input, textarea, select, summary, label, [role='button'], p, h1, h2, h3, h4, li, span, b, code, pre, img, svg, canvas, nav, footer, .card, .panel, .install, .kit-code",
        );
      const drag = { on: false, x: 0, y: 0, vx: 0, vy: 0, ax: 0, ay: 0 };
      const ripple = (x: number, y: number) =>
        uniforms.uRipple.value.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1, uniforms.uTime.value);
      const onDown = (e: PointerEvent) => {
        if (!blank(e.target) || e.button !== 0) return;
        ripple(e.clientX, e.clientY);
        if (e.pointerType === "touch") return; // the finger is for scrolling
        e.preventDefault();
        drag.on = true;
        drag.x = e.clientX;
        drag.y = e.clientY;
      };
      const onUp = () => {
        drag.on = false;
        site?.removeAttribute("data-grabbing");
      };
      const onHover = (e: PointerEvent) => {
        if (drag.on) {
          drag.vx = (e.clientX - drag.x) * 0.006;
          drag.vy = (e.clientY - drag.y) * 0.004;
          drag.x = e.clientX;
          drag.y = e.clientY;
          drag.ax += drag.vx;
          drag.ay = clamp(drag.ay + drag.vy, -0.9, 0.9);
          site?.setAttribute("data-grabbing", "");
          return;
        }
        if (blank(e.target)) site?.setAttribute("data-grab", "");
        else site?.removeAttribute("data-grab");
      };
      addEventListener("pointermove", onHover, { passive: true });
      addEventListener("pointermove", onMove, { passive: true });
      addEventListener("pointerup", onUp);
      addEventListener("pointercancel", onUp);
      document.addEventListener("pointerleave", onLeave);
      addEventListener("pointerdown", onDown);

      let dim = 1;
      const resize = () => {
        const w = innerWidth;
        const h = innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        uniforms.uAspect.value = w / h;
        const tall = touch && w < h;
        uniforms.uScale.value = tall ? 0.66 : Math.min(1, w / h / 1.5 + 0.15);
        uniforms.uOffK.value = tall || w < 900 ? 0 : 1;
        dim = tall ? 0.72 : 1;
      };
      resize();
      addEventListener("resize", resize);

      const state = { stage: 0, alpha: 0 };
      let lastY = scrollY;
      let warp = 0;
      const clock = new THREE.Clock();
      let first = true;
      renderer.setAnimationLoop(() => {
        if (document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const goal = target();
        state.stage += (goal.stage - state.stage) * (1 - Math.exp(-dt * 3));
        state.alpha += (goal.alpha - state.alpha) * (1 - Math.exp(-dt * 2));
        const dy = scrollY - lastY;
        lastY = scrollY;
        warp += (clamp(Math.abs(dy) / 120, 0, 1) - warp) * (1 - Math.exp(-dt * 6));
        mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 8));
        mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 8));

        uniforms.uTime.value += dt;
        uniforms.uStage.value = state.stage;
        uniforms.uAlpha.value = state.alpha * dim;
        uniforms.uWarp.value = warp;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        if (drag.on) {
          drag.vx *= Math.exp(-dt * 12);
        } else {
          drag.vx *= Math.exp(-dt * 1.6);
          drag.ax += drag.vx;
          drag.ay *= Math.exp(-dt * 1.2);
          if (Math.abs(drag.vx) < 0.002) {
            drag.ax = Math.atan2(Math.sin(drag.ax), Math.cos(drag.ax));
            drag.ax *= Math.exp(-dt * 0.9);
          }
        }
        uniforms.uDrag.value.set(drag.ax, drag.ay);
        if (touch) {
          const sway = Math.sin(scrollY * 0.0016) * 0.9;
          uniforms.uSway.value += (sway - uniforms.uSway.value) * (1 - Math.exp(-dt * 4));
        }

        const light = uniforms.uDark.value > 0.5 ? 0 : 1;
        const sa = Math.min(Math.floor(state.stage), S - 1);
        hueNow.copy(hues[sa][light]).lerp(hues[Math.min(sa + 1, S - 1)][light], smooth(clamp(state.stage - sa, 0, 1)));
        uniforms.uAccent.value.copy(hueNow);
        el.style.setProperty("--wash", `${Math.round(hueNow.r * 255)} ${Math.round(hueNow.g * 255)} ${Math.round(hueNow.b * 255)}`);
        el.style.setProperty("--wash-x", `${50 + Math.sin(state.stage * Math.PI * 0.5) * 32}%`);
        el.style.setProperty("--wash-y", `${45 + Math.cos(state.stage * 1.7) * 18}%`);

        // Where the closing panel's centre is, in world units at z = 0.
        const cta = document.querySelector<HTMLElement>("#start .cta-panel");
        if (cta) {
          const b = cta.getBoundingClientRect();
          const worldH = 2 * 13 * Math.tan((20 * Math.PI) / 180);
          const want = (-(b.top + b.height / 2 - innerHeight / 2) * worldH) / innerHeight / uniforms.uScale.value;
          uniforms.uLastY.value += (want - uniforms.uLastY.value) * (1 - Math.exp(-dt * 8));
        }

        const lean = Math.abs(mouse.tx) < 2 ? 1 : 0;
        camera.position.set(mouse.x * 0.6 * lean, mouse.y * 0.4 * lean + Math.sin(state.stage * 1.3) * 0.6, 13);
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
        if (first) {
          first = false;
          el.dataset.on = "";
        }
      });

      stop = () => {
        renderer.setAnimationLoop(null);
        mo.disconnect();
        removeEventListener("pointermove", onMove);
        removeEventListener("pointermove", onHover);
        removeEventListener("pointerup", onUp);
        removeEventListener("pointercancel", onUp);
        document.removeEventListener("pointerleave", onLeave);
        removeEventListener("pointerdown", onDown);
        removeEventListener("touchstart", onTouch);
        removeEventListener("touchmove", onTouch);
        removeEventListener("touchend", onTouchEnd);
        clearTimeout(lift);
        removeEventListener("resize", resize);
        geo.dispose();
        mat.dispose();
        tex.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return <div ref={host} className="dk-field" aria-hidden="true" />;
}
