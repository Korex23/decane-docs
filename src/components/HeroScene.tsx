"use client";
import { useEffect, useRef } from "react";
import type * as T from "three";

// The hero's world: an autumn valley at golden hour, the kit's gold as a
// landscape. The village on the left is your users. Lights leave it, and
// come up the road from the front, and travel to the enclave: the white
// tower with the gold dome on the knoll. For each sign-in that arrives, the
// enclave sends a gold coin, a wallet, to the three chain towers on the hill
// beyond: Ethereum, Solana, Tron. At dusk (the dark theme) the windows and
// the enclave light up.
//
// For realism: a physically based sky that lights the scene and reflects in
// a lake with real reflections, low-sun shadows, thousands of instanced
// trees, mountains hazed into the distance, birds, drifting clouds and
// falling leaves. three.js loads after first paint; reduced motion gets one
// still frame, and without WebGL the CSS sky stays.

// ── terrain ────────────────────────────────────────────────────────────────

/** Smooth value noise in 2D, seeded by a fixed hash: the same land every load. */
function noise2(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const h = (a: number, b: number) => {
    const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
  return (a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v) * 2 - 1;
}
function fbm(x: number, y: number, oct = 5): number {
  let s = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    s += a * noise2(x * f, y * f);
    f *= 2.03;
    a *= 0.5;
  }
  return s;
}
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, k: number) => a + (b - a) * k;

const WATER = 0.6;
const LAKE = { x: -13, z: 4 };
const ENCLAVE = { x: 9, z: -3, level: 4.6 };
const CHAINS = { x: 27, z: -15, level: 7.4 };
const VILLAGE = { x: -25, z: -9, level: 3.4 };

/** Meadows in a valley, mountains behind, a lake, and level ground where things stand. */
function heightAt(x: number, z: number): number {
  let h = fbm(x * 0.035 + 11, z * 0.035 - 4, 4) * 3 + 1.8;
  h += ((Math.abs(x - 2) / 48) ** 2) * 8;
  const r = 1 - Math.abs(fbm(x * 0.016 + 3, z * 0.02 - 7, 5));
  h += smooth(-45, -120, z) * (r * r * r * 34 + 4);
  h -= Math.exp(-((x - LAKE.x) ** 2) / 95 - ((z - LAKE.z) ** 2) / 42) * 6;
  const level = (p: { x: number; z: number; level: number }, rr: number) => {
    h = mix(h, p.level, Math.exp(-((x - p.x) ** 2 + (z - p.z) ** 2) / rr));
  };
  level(ENCLAVE, 34);
  level(CHAINS, 70);
  level(VILLAGE, 80);
  return h;
}
function slopeAt(x: number, z: number): number {
  const e = 0.6;
  const dx = heightAt(x + e, z) - heightAt(x - e, z);
  const dz = heightAt(x, z + e) - heightAt(x, z - e);
  return 1 - (2 * e) / Math.hypot(dx, dz, 2 * e);
}

/** Small, deterministic random numbers. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A tiling normal map of small waves for the lake. */
function waveNormals(size: number): Uint8Array<ArrayBuffer> {
  const R = rng(7);
  const waves = Array.from({ length: 14 }, () => ({
    fx: Math.round((R() - 0.5) * 14), fy: Math.round((R() - 0.5) * 14), ph: R() * 6.283, a: 0.3 + R(),
  }));
  const h = (u: number, v: number) => waves.reduce((s, w) => s + w.a * Math.sin((w.fx * u + w.fy * v) * 6.283 + w.ph), 0);
  const out = new Uint8Array(new ArrayBuffer(size * size * 4));
  const e = 1 / size;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const nx = (h(u - e, v) - h(u + e, v)) * 0.6, ny = (h(u, v - e) - h(u, v + e)) * 0.6;
      const len = Math.hypot(nx, ny, 1);
      const i = (y * size + x) * 4;
      out[i] = ((nx / len) * 0.5 + 0.5) * 255;
      out[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      out[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      out[i + 3] = 255;
    }
  }
  return out;
}

function canvasTexture(THREE: typeof T, draw: (g: CanvasRenderingContext2D, s: number) => void, s = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = s;
  draw(c.getContext("2d")!, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = () => {};
    let cancelled = false;

    void Promise.all([
      import("three"),
      import("three/examples/jsm/objects/Sky.js"),
      import("three/examples/jsm/objects/Water.js"),
      import("three/examples/jsm/utils/BufferGeometryUtils.js"),
    ]).then(([THREE, { Sky }, { Water }, { mergeGeometries }]) => {
      if (cancelled) return;
      let renderer: T.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      const narrow = innerWidth <= 640;
      const R = rng(42);
      renderer.setPixelRatio(Math.min(devicePixelRatio, narrow ? 1.5 : 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.append(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 5000);
      const site = el.closest<HTMLElement>(".site");
      const dark = () => site?.dataset.theme === "dark";
      const textures: T.Texture[] = [];

      // ── sky and light ──────────────────────────────────────────────────
      const sky = new Sky();
      sky.scale.setScalar(4000);
      scene.add(sky);
      const sunDir = new THREE.Vector3();
      const sun = new THREE.DirectionalLight(0xffffff, 3);
      sun.castShadow = true;
      sun.shadow.mapSize.set(narrow ? 1024 : 2048, narrow ? 1024 : 2048);
      sun.shadow.bias = -0.0005;
      sun.shadow.normalBias = 0.04;
      Object.assign(sun.shadow.camera, { left: -48, right: 48, top: 36, bottom: -36, near: 1, far: 260 });
      scene.add(sun, sun.target);
      sun.target.position.set(0, 0, -6);
      const hemi = new THREE.HemisphereLight(0xc6d8ff, 0x8a7444, 0.7);
      scene.add(hemi);
      const pmrem = new THREE.PMREMGenerator(renderer);
      let envRT: T.WebGLRenderTarget | null = null;
      const skyScene = new THREE.Scene();

      // ── terrain ────────────────────────────────────────────────────────
      const W = 460, D = 280;
      const ground = new THREE.PlaneGeometry(W, D, narrow ? 200 : 340, narrow ? 120 : 210);
      ground.rotateX(-Math.PI / 2);
      ground.translate(0, 0, -D / 2 + 60);
      const pos = ground.attributes.position as T.BufferAttribute;
      for (let i = 0; i < pos.count; i++) pos.setY(i, heightAt(pos.getX(i), pos.getZ(i)));
      ground.computeVertexNormals();
      const nrm = ground.attributes.normal as T.BufferAttribute;
      const colors = new Float32Array(pos.count * 3);
      const meadowA = new THREE.Color(0x8f9a45), meadowB = new THREE.Color(0xcfae55), meadowC = new THREE.Color(0xb98a3e);
      const sand = new THREE.Color(0xcbb48a), rock = new THREE.Color(0x857a6c), snow = new THREE.Color(0xf4f3ef);
      const c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        const n = fbm(x * 0.06 + 3, z * 0.06, 3);
        c.copy(meadowA).lerp(meadowB, clamp01(0.5 + n * 1.3));
        c.lerp(meadowC, clamp01(fbm(x * 0.15, z * 0.15 + 9, 2) * 1.2) * 0.5);
        const slope = 1 - nrm.getY(i);
        c.lerp(rock, smooth(0.18, 0.4, slope) * 0.9);
        c.lerp(rock, smooth(13, 20, y) * 0.8);
        c.lerp(snow, smooth(24, 31, y + n * 4) * (1 - smooth(0.35, 0.6, slope) * 0.6));
        c.lerp(sand, 1 - smooth(WATER + 0.1, WATER + 0.9, y));
        colors.set([c.r, c.g, c.b], i * 3);
      }
      ground.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const land = new THREE.Mesh(ground, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
      land.receiveShadow = true;
      scene.add(land);

      // ── the lake, with real reflections ────────────────────────────────
      const NS = 256;
      const normals = new THREE.DataTexture(waveNormals(NS), NS, NS, THREE.RGBAFormat);
      normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
      normals.needsUpdate = true;
      textures.push(normals);
      const water = new Water(new THREE.PlaneGeometry(70, 46), {
        textureWidth: narrow ? 256 : 512,
        textureHeight: narrow ? 256 : 512,
        waterNormals: normals,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xfff0d0,
        waterColor: 0x2f4f55,
        distortionScale: 0.9,
        fog: true,
      });
      water.rotation.x = -Math.PI / 2;
      water.position.set(LAKE.x + 4, WATER, LAKE.z - 2);
      water.material.uniforms["size"]!.value = 6;
      scene.add(water);

      // ── roads ──────────────────────────────────────────────────────────
      const curve = (pts: [number, number][]) =>
        new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, heightAt(x, z), z)));
      const roads = [
        curve([[-25, -9], [-18, -9.6], [-10, -8.6], [-2, -6.4], [4, -4], [7.6, -3]]),
        curve([[34, 40], [23, 27], [15.5, 14], [11.5, 4.5], [9.4, -0.6]]),
        curve([[-50, 34], [-36, 22], [-30, 8], [-27, -3], [-25, -9]]),
      ];
      const roadPts: [number, number][] = [];
      const roadMat = new THREE.MeshStandardMaterial({
        color: 0xe2d3b3, roughness: 1, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
      });
      for (const rd of roads) {
        const segs = 220, half = 0.75;
        const verts: number[] = [], idx: number[] = [];
        const p = new THREE.Vector3(), t = new THREE.Vector3();
        for (let i = 0; i <= segs; i++) {
          rd.getPointAt(i / segs, p);
          rd.getTangentAt(i / segs, t);
          const l = Math.hypot(t.x, t.z) || 1;
          const sx = -t.z / l, sz = t.x / l;
          for (const s of [-1, 1]) {
            const x = p.x + sx * half * s, z = p.z + sz * half * s;
            verts.push(x, heightAt(x, z) + 0.06, z);
          }
          roadPts.push([p.x, p.z]);
          if (i < segs) idx.push(2 * i, 2 * i + 2, 2 * i + 1, 2 * i + 1, 2 * i + 2, 2 * i + 3);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
        g.setIndex(idx);
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, roadMat);
        m.receiveShadow = true;
        scene.add(m);
      }
      const nearRoad = (x: number, z: number, d: number) => {
        for (const [px, pz] of roadPts) if ((px - x) ** 2 + (pz - z) ** 2 < d * d) return true;
        return false;
      };

      // ── forests ────────────────────────────────────────────────────────
      const tint = (g: T.BufferGeometry, hex: number) => {
        const col = new THREE.Color(hex);
        const n = g.attributes.position!.count;
        const a = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) a.set([col.r, col.g, col.b], i * 3);
        g.setAttribute("color", new THREE.BufferAttribute(a, 3));
        g.deleteAttribute("uv");
        return g;
      };
      const trunk = () => tint(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 5).translate(0, 0.8, 0).toNonIndexed(), 0x4a3424);
      const pineGeo = mergeGeometries([
        trunk(),
        tint(new THREE.ConeGeometry(1.05, 2.4, 7).translate(0, 2.2, 0).toNonIndexed(), 0xffffff),
        tint(new THREE.ConeGeometry(0.8, 2.0, 7).translate(0, 3.3, 0).toNonIndexed(), 0xffffff),
        tint(new THREE.ConeGeometry(0.5, 1.5, 7).translate(0, 4.3, 0).toNonIndexed(), 0xffffff),
      ])!;
      const crown = new THREE.IcosahedronGeometry(1.35, 1);
      {
        const p = crown.attributes.position as T.BufferAttribute;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
          const f = 1 + noise2(x * 2.1 + 5, z * 2.1 + y * 1.7) * 0.18;
          p.setXYZ(i, x * f, y * f * 1.1 + 2.6, z * f);
        }
      }
      const leafGeo = mergeGeometries([trunk(), tint(crown, 0xffffff)])!;
      leafGeo.computeVertexNormals();
      pineGeo.computeVertexNormals();
      const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.9 });
      const pinesC = [0x2b4a33, 0x335a3a, 0x24402e, 0x3e5e3c, 0x2f5040];
      const autumnC = [0xe3a531, 0xd9822b, 0xc4572a, 0xf0c34a, 0xb8462a, 0xe8b64a, 0x9aa340, 0xcf6a2c];
      const N = narrow ? 800 : 1700;
      const pines = new THREE.InstancedMesh(pineGeo, treeMat, N);
      const leafy = new THREE.InstancedMesh(leafGeo, treeMat, N);
      let np = 0, nl = 0;
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e3 = new THREE.Euler(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3();
      const clear = (x: number, z: number, p: { x: number; z: number }, r: number) => (x - p.x) ** 2 + (z - p.z) ** 2 > r * r;
      for (let tries = 0; tries < N * 6 && (np < N || nl < N); tries++) {
        const x = (R() - 0.5) * 240, z = 42 - R() * 160;
        if (z > 12 && Math.abs(x) < 34 - (z - 12) * 0.2) continue;
        const h = heightAt(x, z);
        if (h < WATER + 0.5 || h > 18 || slopeAt(x, z) > 0.42) continue;
        if (!clear(x, z, ENCLAVE, 6.5) || !clear(x, z, CHAINS, 8) || !clear(x, z, VILLAGE, 7.5)) continue;
        if (fbm(x * 0.045 + 20, z * 0.045, 3) < 0.04 + (z > 0 ? 0.12 : 0)) continue;
        if (nearRoad(x, z, 2.2)) continue;
        const pine = R() < 0.3 + clamp01(h / 14) * 0.45 + (z < -30 ? 0.2 : 0);
        const k = 0.55 + R() * 0.5;
        e3.set((R() - 0.5) * 0.08, R() * 6.283, (R() - 0.5) * 0.08);
        m4.compose(v3.set(x, h - 0.15, z), q.setFromEuler(e3), s3.set(k, k * (0.85 + R() * 0.35), k));
        if (pine && np < N) {
          pines.setMatrixAt(np, m4);
          pines.setColorAt(np++, c.set(pinesC[Math.floor(R() * pinesC.length)]!).multiplyScalar(0.9 + R() * 0.2));
        } else if (!pine && nl < N) {
          leafy.setMatrixAt(nl, m4);
          leafy.setColorAt(nl++, c.set(autumnC[Math.floor(R() * autumnC.length)]!).multiplyScalar(0.9 + R() * 0.2));
        }
      }
      pines.count = np;
      leafy.count = nl;
      for (const m of [pines, leafy]) {
        m.castShadow = m.receiveShadow = true;
        m.instanceMatrix.needsUpdate = true;
        if (m.instanceColor) m.instanceColor.needsUpdate = true;
        scene.add(m);
      }

      // ── the village: your users ────────────────────────────────────────
      const wallMat = new THREE.MeshStandardMaterial({ color: 0xf2ebdd, roughness: 0.8 });
      const roofMats = [0xb4532e, 0x3c3a38, 0xc98a2e].map((col) => new THREE.MeshStandardMaterial({ color: col, roughness: 0.75, flatShading: true }));
      const windowMat = new THREE.MeshStandardMaterial({ color: 0x2a2620, emissive: 0xffb44a, emissiveIntensity: 0.15 });
      const houseBody = new THREE.BoxGeometry(1.8, 1.2, 1.3).translate(0, 0.6, 0);
      const houseRoof = new THREE.CylinderGeometry(0.95, 0.95, 2.0, 3, 1).rotateZ(Math.PI / 2).rotateX(Math.PI / 6);
      const houseWin = new THREE.BoxGeometry(0.32, 0.32, 0.04);
      const houses: [number, number, number][] = [
        [-25, -9, 0.1], [-22.2, -11, -0.3], [-28, -11.5, 0.4], [-29.5, -7.4, 1.4], [-21.4, -7.6, -0.1], [-26, -13.6, 0.2],
        [-23.5, -5.2, 0.3], [-31, -10.4, 1.2], [-19.6, -10.4, -0.5], [-27.3, -4.6, 0.6],
        [-36, 3, 0.8], [-33, 15, 0.4], [18.5, 18, -0.4], [-6, -15, 0.2], [24, 8, -0.6],
      ];
      for (const [x, z, ry] of houses) {
        if (nearRoad(x, z, 1.6)) continue;
        const g = new THREE.Group();
        const k = 0.85 + R() * 0.4;
        const body = new THREE.Mesh(houseBody, wallMat);
        const roof = new THREE.Mesh(houseRoof, roofMats[Math.floor(R() * 3)]!);
        roof.position.y = 1.2 + 0.47;
        roof.scale.set(1, 0.62, 0.78);
        body.castShadow = body.receiveShadow = roof.castShadow = true;
        g.add(body, roof);
        for (const wx of [-0.45, 0.45]) {
          const w = new THREE.Mesh(houseWin, windowMat);
          w.position.set(wx, 0.66, 0.66);
          g.add(w);
        }
        g.position.set(x, heightAt(x, z) - 0.05, z);
        g.rotation.y = ry;
        g.scale.setScalar(k);
        scene.add(g);
      }

      // ── the enclave ────────────────────────────────────────────────────
      const E = new THREE.Vector3(ENCLAVE.x, heightAt(ENCLAVE.x, ENCLAVE.z), ENCLAVE.z);
      const enclave = new THREE.Group();
      const stone = new THREE.MeshStandardMaterial({ color: 0xe8e1d2, roughness: 0.85 });
      const shell = new THREE.MeshPhysicalMaterial({ color: 0xf7f4ee, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.2 });
      const gold = new THREE.MeshPhysicalMaterial({ color: 0xe0a83a, metalness: 1, roughness: 0.24, emissive: 0x6b4300, emissiveIntensity: 0.25 });
      const glowGold = new THREE.MeshBasicMaterial({ color: 0xffc457, transparent: true, opacity: 0.9 });
      const add = (g: T.BufferGeometry, m: T.Material, y: number, shadow = true) => {
        const mesh = new THREE.Mesh(g, m);
        mesh.position.y = y;
        mesh.castShadow = shadow;
        mesh.receiveShadow = true;
        enclave.add(mesh);
        return mesh;
      };
      add(new THREE.CylinderGeometry(4.4, 4.9, 0.6, 56), stone, 0.1);
      add(new THREE.CylinderGeometry(2.3, 2.5, 1.1, 48), shell, 0.95);
      add(new THREE.CylinderGeometry(1.6, 1.75, 4.2, 48), shell, 3.6);
      add(new THREE.CylinderGeometry(1.68, 1.68, 0.22, 48), gold, 2.4);
      add(new THREE.CylinderGeometry(1.66, 1.66, 0.3, 48), gold, 5.75);
      add(new THREE.SphereGeometry(1.62, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), gold, 5.9);
      add(new THREE.ConeGeometry(0.16, 1.1, 16), gold, 8.0);
      const door = add(new THREE.BoxGeometry(0.8, 1.3, 0.1), glowGold, 2.0, false);
      door.position.z = 1.66;
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffc457, transparent: true, opacity: 0.8 });
      const ring = add(new THREE.TorusGeometry(3.4, 0.07, 8, 96).rotateX(Math.PI / 2), ringMat, 0.45, false);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 1.4, 60, 32, 1, true).translate(0, 30, 0),
        new THREE.MeshBasicMaterial({ color: 0xffc457, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }),
      );
      beam.position.y = 8.4;
      enclave.add(beam);
      enclave.position.copy(E);
      enclave.scale.setScalar(narrow ? 1.25 : 1.1);
      scene.add(enclave);
      const domeTop = E.clone().setY(E.y + 9 * enclave.scale.y);

      // ── the chains ─────────────────────────────────────────────────────
      const chainColours = [0x627eea, 0x9945ff, 0xeb0029];
      const towers = chainColours.map((col, i) => {
        const x = CHAINS.x - 4 + i * 4, z = CHAINS.z + (i - 1) * 0.8;
        const y = heightAt(x, z);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.5, 32), stone);
        base.position.set(x, y + 0.2, z);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.55, 5.6, 6), shell);
        shaft.position.set(x, y + 3.2, z);
        for (const m of [base, shaft]) {
          m.castShadow = m.receiveShadow = true;
          scene.add(m);
        }
        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.95, 0),
          new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.08, clearcoat: 1, emissive: col, emissiveIntensity: 0.35, flatShading: true }),
        );
        gem.castShadow = true;
        scene.add(gem);
        return { gem, top: new THREE.Vector3(x, y + 7.4, z) };
      });

      // ── glow, travellers and coins ─────────────────────────────────────
      const glowTex = canvasTexture(THREE, (g, s) => {
        const r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        r.addColorStop(0, "rgba(255,255,255,1)");
        r.addColorStop(0.25, "rgba(255,255,255,.55)");
        r.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = r;
        g.fillRect(0, 0, s, s);
      });
      textures.push(glowTex);
      const glow = (col: number, size: number) => {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: col, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
        sp.scale.setScalar(size);
        return sp;
      };
      // Google, email (gold), X, phone.
      const providers = [0x5b9bff, 0xffc457, 0xffffff, 0x4cd07d];
      const orbGeo = new THREE.SphereGeometry(0.32, 20, 12);
      const travellers = [0, 1, 2].flatMap((r) =>
        Array.from({ length: r === 2 ? 4 : 5 }, (_, i) => {
          const col = providers[(i + r) % providers.length]!;
          const g = new THREE.Group();
          const orb = new THREE.Mesh(orbGeo, new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 1.2, roughness: 0.3 }));
          g.add(orb, glow(col, 2.6));
          scene.add(g);
          return { g, road: r, offset: i / (r === 2 ? 4 : 5) };
        }),
      );
      const coinGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.12, 40);
      const coinMat = new THREE.MeshPhysicalMaterial({ color: 0xf0bd4f, metalness: 1, roughness: 0.18, emissive: 0x7a4f00, emissiveIntensity: 0.35 });
      const coins = Array.from({ length: 8 }, () => {
        const g = new THREE.Group();
        const m = new THREE.Mesh(coinGeo, coinMat);
        m.castShadow = true;
        g.add(m, glow(0xffc457, 3.2));
        g.visible = false;
        scene.add(g);
        return { g, m, to: 0, t0: -10 };
      });

      // ── birds, clouds, leaves ──────────────────────────────────────────
      const wing = new THREE.BufferGeometry();
      wing.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, -0.12, 0, 0, 0.16, 0.75, 0.05, -0.05], 3));
      wing.computeVertexNormals();
      const birdMat = new THREE.MeshBasicMaterial({ color: 0x2c2a28, side: THREE.DoubleSide });
      const birds = Array.from({ length: narrow ? 8 : 15 }, (_, i) => {
        const g = new THREE.Group();
        const l = new THREE.Mesh(wing, birdMat), r = new THREE.Mesh(wing, birdMat);
        r.scale.x = -1;
        g.add(l, r);
        g.scale.setScalar(1.4);
        scene.add(g);
        return { g, l, r, flock: i % 3, ox: (R() - 0.5) * 5, oy: (R() - 0.5) * 2, oz: (R() - 0.5) * 4, ph: R() * 6 };
      });
      const puffTex = canvasTexture(THREE, (g, s) => {
        for (let i = 0; i < 14; i++) {
          const x = s * (0.2 + R() * 0.6), y = s * (0.42 + R() * 0.2), rr = s * (0.1 + R() * 0.16);
          const gr = g.createRadialGradient(x, y, 0, x, y, rr);
          gr.addColorStop(0, "rgba(255,255,255,.75)");
          gr.addColorStop(1, "rgba(255,255,255,0)");
          g.fillStyle = gr;
          g.fillRect(0, 0, s, s);
        }
      }, 256);
      textures.push(puffTex);
      const clouds = Array.from({ length: 9 }, () => {
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, fog: false, opacity: 0.85 }));
        sp.position.set((R() - 0.5) * 520, 70 + R() * 70, -220 - R() * 160);
        sp.scale.set(120 + R() * 90, 48 + R() * 30, 1);
        scene.add(sp);
        return sp;
      });
      const leafCount = reduce ? 0 : narrow ? 30 : 70;
      const leaves = new THREE.InstancedMesh(
        new THREE.PlaneGeometry(0.22, 0.15),
        new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.8 }),
        Math.max(1, leafCount),
      );
      const leafState = Array.from({ length: leafCount }, (_, i) => {
        leaves.setColorAt(i, c.set(autumnC[i % 6]!));
        return { x: (R() - 0.5) * 40, y: R() * 16, z: 14 + R() * 22, sp: 0.5 + R() * 0.7, ph: R() * 6, rot: R() * 6 };
      });
      leaves.count = leafCount;
      if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
      scene.add(leaves);

      // ── day and dusk ───────────────────────────────────────────────────
      const setSky = () => {
        const d = dark();
        const elevation = d ? -2.6 : 11;
        const u = sky.material.uniforms;
        u["turbidity"]!.value = d ? 3 : 5.5;
        u["rayleigh"]!.value = d ? 2.6 : 1.5;
        u["mieCoefficient"]!.value = d ? 0.004 : 0.006;
        u["mieDirectionalG"]!.value = 0.82;
        sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elevation), THREE.MathUtils.degToRad(232));
        u["sunPosition"]!.value.copy(sunDir);
        sun.position.copy(sunDir).multiplyScalar(140).add(sun.target.position);
        if (d) sun.position.y = Math.max(sun.position.y, 30);
        sun.color.set(d ? 0x8fa3d9 : 0xffdcae);
        sun.intensity = d ? 0.35 : 2.8;
        hemi.color.set(d ? 0x5a6a9a : 0xc6d8ff);
        hemi.groundColor.set(d ? 0x2a2418 : 0x8a7444);
        hemi.intensity = d ? 0.45 : 0.7;
        renderer.toneMappingExposure = 0.5;
        const wu = water.material.uniforms;
        wu["sunDirection"]!.value.copy(sunDir).normalize();
        wu["sunColor"]!.value.set(d ? 0x6070a0 : 0xfff0d0);
        wu["waterColor"]!.value.set(d ? 0x101722 : 0x2f4f55);
        windowMat.emissiveIntensity = d ? 2.6 : 0.12;
        gold.emissiveIntensity = d ? 0.6 : 0.25;
        (beam.material as T.MeshBasicMaterial).opacity = d ? 0.16 : 0;
        for (const cl of clouds) (cl.material as T.SpriteMaterial).color.set(d ? 0x4a4660 : 0xffffff);
        birdMat.color.set(d ? 0x101014 : 0x2c2a28);
        const copy = new Sky();
        copy.scale.setScalar(4000);
        (copy.material as T.ShaderMaterial).uniforms = sky.material.uniforms;
        skyScene.clear();
        skyScene.add(copy);
        envRT?.dispose();
        envRT = pmrem.fromScene(skyScene, 0, 0.1, 5000);
        scene.environment = envRT.texture as T.Texture;
        scene.environmentIntensity = d ? 0.35 : 0.6;
        scene.fog = new THREE.FogExp2(d ? 0x1b1d2b : 0xe4dccb, d ? 0.0062 : 0.0052);
      };
      setSky();

      // ── sizing, input, loop ────────────────────────────────────────────
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.fov = w < 700 ? 46 : 32;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / innerHeight) * 2 - 1;
      };
      addEventListener("pointermove", onMove, { passive: true });

      const mo = new MutationObserver(setSky);
      if (site) mo.observe(site, { attributes: true, attributeFilter: ["data-theme"] });

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
      io.observe(el);

      const clock = new THREE.Clock();
      let t = 0;
      let lastArrival = -1;
      const tmp = new THREE.Vector3();
      const ROAD_SPEED = [0.034, 0.03, 0.022];
      const frame = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        t += dt;
        mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 2.5));
        mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 2.5));

        for (const tr of travellers) {
          const u = (t * ROAD_SPEED[tr.road]! + tr.offset) % 1;
          roads[tr.road]!.getPointAt(u, tmp);
          tr.g.position.set(tmp.x, heightAt(tmp.x, tmp.z) + 0.75 + Math.sin(t * 2.4 + tr.offset * 9) * 0.08, tmp.z);
          const s = tr.road === 2 ? Math.min(1, u / 0.05) : u > 0.95 ? (1 - u) / 0.05 : u < 0.04 ? u / 0.04 : 1;
          tr.g.scale.setScalar(Math.max(0.001, s));
        }
        const arrivals = Math.floor(t * (ROAD_SPEED[0]! * 5 + ROAD_SPEED[1]! * 5));
        if (arrivals !== lastArrival) {
          lastArrival = arrivals;
          const coin = coins[arrivals % coins.length]!;
          coin.t0 = t;
          coin.to = arrivals % 3;
        }
        for (const coin of coins) {
          const k = (t - coin.t0) / 2.4;
          coin.g.visible = k >= 0 && k <= 1;
          if (!coin.g.visible) continue;
          const target = towers[coin.to]!.top;
          const e = k * k * (3 - 2 * k);
          coin.g.position.set(
            mix(domeTop.x, target.x, e),
            mix(domeTop.y, target.y, e) + Math.sin(k * Math.PI) * 7,
            mix(domeTop.z, target.z, e),
          );
          coin.m.rotation.set(Math.PI / 2, 0, t * 5);
          coin.g.scale.setScalar(k > 0.9 ? Math.max(0.001, (1 - k) / 0.1) : 1);
        }
        towers.forEach((tw, i) => {
          tw.gem.rotation.y = t * 0.7 + i;
          tw.gem.position.set(tw.top.x, tw.top.y + Math.sin(t * 1.4 + i) * 0.25, tw.top.z);
        });
        ring.scale.setScalar(1 + Math.sin(t * 2) * 0.03);
        ringMat.opacity = 0.6 + Math.sin(t * 2) * 0.3;

        for (const b of birds) {
          const a = t * 0.05 + b.flock * 2.1;
          b.g.position.set(Math.sin(a) * 70 + b.ox, 30 + b.flock * 5 + b.oy + Math.sin(t * 0.7 + b.ph) * 0.6, -40 + Math.cos(a) * 26 + b.oz);
          b.g.rotation.y = -a + Math.PI;
          const flap = Math.sin(t * 7 + b.ph) * 0.6;
          b.l.rotation.z = flap;
          b.r.rotation.z = -flap;
        }
        for (const cl of clouds) cl.position.x = ((cl.position.x + dt * 1.4 + 300) % 600) - 300;
        leafState.forEach((lf, i) => {
          lf.y -= dt * lf.sp;
          if (lf.y < 0) lf.y = 16;
          e3.set(t * lf.sp * 2 + lf.rot, t + lf.ph, Math.sin(t * 1.3 + lf.ph));
          m4.compose(v3.set(lf.x + Math.sin(t * 0.8 + lf.ph) * 1.2, lf.y, lf.z), q.setFromEuler(e3), s3.set(1, 1, 1));
          leaves.setMatrixAt(i, m4);
        });
        if (leafCount) leaves.instanceMatrix.needsUpdate = true;
        water.material.uniforms["time"]!.value = t * 0.35;

        // Over the lake toward the enclave, the mountains behind the
        // headline; a slow drift, and a lean toward the cursor.
        camera.position.set(-9 + mouse.x * 2.5 + Math.sin(t * 0.06) * 1.5, 22 - mouse.y * 1, 72);
        camera.lookAt(-3, 15.5, -20);
        renderer.render(scene, camera);
      };

      if (reduce) {
        t = 7;
        frame();
      } else {
        renderer.setAnimationLoop(() => {
          if (document.hidden || !visible) return;
          frame();
        });
      }
      el.dataset.on = "";

      stop = () => {
        renderer.setAnimationLoop(null);
        removeEventListener("pointermove", onMove);
        ro.disconnect();
        io.disconnect();
        mo.disconnect();
        scene.traverse((o) => {
          const m = o as T.Mesh;
          m.geometry?.dispose?.();
          const mat = m.material as T.Material | T.Material[] | undefined;
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat?.dispose?.();
        });
        textures.forEach((x) => x.dispose());
        envRT?.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  return <div ref={host} className="lp-scene" aria-hidden="true" />;
}
