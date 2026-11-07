"use client";
import { useEffect, useRef } from "react";

// The hero's scene: wind-shaped dunes under a low sun, and the product as a
// small world in it. Sign-ins (white tiles with a provider's colour) travel a
// path into the sealed enclave, a white cube with a gold seam; for each one
// that arrives, the enclave sends a gold wallet coin up to the three chains
// on the rise beyond it: Ethereum, Solana, Tron.
//
// For realism: a physically based sky (three's Sky shader) that also lights
// the scene and gives the metals something to reflect, ACES tone mapping,
// dunes from layered noise with a procedural ripple normal map, haze that
// melts the distance into the horizon, and soft shadows. The camera drifts
// and leans toward the cursor. three.js loads after first paint; reduced
// motion gets one still frame, and no WebGL leaves the CSS sky alone.

// ── terrain ────────────────────────────────────────────────────────────────

/** Smooth value noise in 2D, seeded by a fixed hash: the same dunes every load. */
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

/**
 * Dunes: crests across the wind with a gentle windward slope and a steeper
 * lee face, warped by noise so no two are alike, over broad swells. A shallow
 * valley carries the path, and a rise holds the three chains.
 */
function duneHeight(x: number, z: number): number {
  const warp = fbm(x * 0.03, z * 0.03, 3) * 6;
  const p = (x * 0.11 + z * 0.05 + warp * 0.18) % 1;
  const phase = ((p % 1) + 1) % 1;
  const crest = phase < 0.72 ? Math.sin((phase / 0.72) * Math.PI * 0.5) : Math.cos(((phase - 0.72) / 0.28) * Math.PI * 0.5);
  const dunes = crest * 1.25 * (0.55 + 0.45 * (fbm(x * 0.02 + 7, z * 0.02, 3) + 1) / 2) * (0.35 + 0.65 * (1 - Math.exp(-((x - 3) ** 2) / 200 - ((z - 2) ** 2) / 80)));
  // The basin where the scene stands is kept low so nothing hides behind a dune.
  const basin = 1 - Math.exp(-((x - 3) ** 2) / 260 - ((z - 1) ** 2) / 120) * 0.75;
  const swell = fbm(x * 0.012, z * 0.016, 4) * 3.2 * basin;
  const valley = -Math.exp(-((x + 2) ** 2) / 70 - ((z - 4) ** 2) / 240) * 1.6;
  const rise = Math.exp(-((x - 9) ** 2) / 22 - ((z + 3) ** 2) / 14) * 1.9;
  return dunes + swell + valley + rise - 0.6;
}

/** A tiling normal map of wind ripples in the sand, drawn once. */
function rippleNormals(size: number): Uint8Array<ArrayBuffer> {
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const w = Math.sin((u * 18 + Math.sin(v * Math.PI * 4) * 0.6 + noise2(u * 6, v * 6) * 0.8) * Math.PI * 2);
      h[y * size + x] = w * 0.5 + noise2(u * 40, v * 40) * 0.25;
    }
  }
  const out = new Uint8Array(new ArrayBuffer(size * size * 4));
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = h[y * size + ((x - 1 + size) % size)]!, r = h[y * size + ((x + 1) % size)]!;
      const d = h[((y - 1 + size) % size) * size + x]!, u = h[((y + 1) % size) * size + x]!;
      const nx = (l - r) * 1.4, ny = (d - u) * 1.4, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * size + x) * 4;
      out[i] = ((nx / len) * 0.5 + 0.5) * 255;
      out[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      out[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      out[i + 3] = 255;
    }
  }
  return out;
}

export function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let stop = () => {};
    let cancelled = false;

    void Promise.all([import("three"), import("three/examples/jsm/objects/Sky.js")]).then(([THREE, { Sky }]) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      const narrow = innerWidth <= 640;
      renderer.setPixelRatio(Math.min(devicePixelRatio, narrow ? 1.5 : 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      el.append(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 4000);
      const site = el.closest<HTMLElement>(".site");
      const dark = () => site?.dataset.theme === "dark";

      // ── sky, sun and the light the sky casts ────────────────────────────
      const sky = new Sky();
      sky.scale.setScalar(3000);
      scene.add(sky);
      const sunDir = new THREE.Vector3();
      const sun = new THREE.DirectionalLight(0xffffff, 3);
      sun.castShadow = true;
      sun.shadow.mapSize.set(narrow ? 1024 : 2048, narrow ? 1024 : 2048);
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.02;
      Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 22, bottom: -22, near: 1, far: 140 });
      scene.add(sun, sun.target);
      const hemi = new THREE.HemisphereLight(0xcfe0ff, 0xc89d63, 0.6);
      scene.add(hemi);
      const pmrem = new THREE.PMREMGenerator(renderer);
      let envRT: InstanceType<typeof THREE.WebGLRenderTarget> | null = null;
      const skyScene = new THREE.Scene();

      const setSky = () => {
        const d = dark();
        // Golden hour by day; just after sunset in the dark theme.
        const elevation = d ? -1.2 : 4.5;
        const azimuth = 205;
        const u = sky.material.uniforms;
        // More haze and less blue scatter: a gold sky, the kit's colour.
        u["turbidity"]!.value = d ? 6 : 11;
        u["rayleigh"]!.value = d ? 3.2 : 0.9;
        u["mieCoefficient"]!.value = 0.012;
        u["mieDirectionalG"]!.value = 0.82;
        sunDir.setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - elevation), THREE.MathUtils.degToRad(azimuth));
        u["sunPosition"]!.value.copy(sunDir);
        sun.position.copy(sunDir).multiplyScalar(60);
        // The kit's gold, as light: warm by day, a gold afterglow at dusk.
        sun.color.set(d ? 0xffc46b : 0xffd28a);
        sun.intensity = d ? 0.55 : 3.1;
        hemi.intensity = d ? 0.22 : 0.55;
        renderer.toneMappingExposure = d ? 0.42 : 0.62;
        // The sky also lights and reflects in everything shiny.
        const copy = new Sky();
        copy.scale.setScalar(3000);
        (copy.material as InstanceType<typeof THREE.ShaderMaterial>).uniforms = sky.material.uniforms;
        skyScene.clear();
        skyScene.add(copy);
        envRT?.dispose();
        envRT = pmrem.fromScene(skyScene, 0, 0.1, 4000);
        scene.environment = envRT.texture as InstanceType<typeof THREE.Texture>;
        scene.environmentIntensity = d ? 0.3 : 0.7;
        // Haze in the kit's paper by day and its ink at dusk.
        const horizon = d ? 0x1f1a14 : 0xeed8b4;
        scene.fog = new THREE.FogExp2(horizon, d ? 0.012 : 0.0105);
      };
      setSky();

      // ── dunes ──────────────────────────────────────────────────────────
      const W = 220, D = 120;
      const ground = new THREE.PlaneGeometry(W, D, narrow ? 180 : 320, narrow ? 100 : 180);
      ground.rotateX(-Math.PI / 2);
      const pos = ground.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
      const colors = new Float32Array(pos.count * 3);
      const lo = new THREE.Color(0xc99b62), hi = new THREE.Color(0xe7c99a), c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), z = pos.getZ(i);
        const y = duneHeight(x, z);
        pos.setY(i, y);
        c.copy(lo).lerp(hi, Math.min(1, Math.max(0, (y + 2.5) / 5 + fbm(x * 0.2, z * 0.2, 2) * 0.12)));
        colors.set([c.r, c.g, c.b], i * 3);
      }
      ground.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      ground.computeVertexNormals();
      const RIP = 256;
      const ripples = new THREE.DataTexture(rippleNormals(RIP), RIP, RIP, THREE.RGBAFormat);
      ripples.wrapS = ripples.wrapT = THREE.RepeatWrapping;
      ripples.repeat.set(70, 38);
      ripples.anisotropy = renderer.capabilities.getMaxAnisotropy();
      ripples.needsUpdate = true;
      const sand = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.96,
        metalness: 0,
        normalMap: ripples,
        normalScale: new THREE.Vector2(0.35, 0.35),
      });
      const groundMesh = new THREE.Mesh(ground, sand);
      groundMesh.receiveShadow = true;
      scene.add(groundMesh);

      // Weathered stones half sunk in the sand.
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x8c7357, roughness: 0.92 });
      for (let i = 0; i < (narrow ? 12 : 26); i++) {
        const g = new THREE.DodecahedronGeometry(0.6, 1);
        const p = g.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
        for (let k = 0; k < p.count; k++) {
          const f = 1 + noise2(p.getX(k) * 3 + i, p.getY(k) * 3 - i) * 0.22;
          p.setXYZ(k, p.getX(k) * f, p.getY(k) * f * 0.7, p.getZ(k) * f);
        }
        g.computeVertexNormals();
        const x = ((i * 37.3) % 80) - 40, z = ((i * 19.7) % 34) - 18;
        if (Math.abs(x + 1) < 7 && z > -3) continue;
        const s = new THREE.Mesh(g, rockMat);
        const k = 0.5 + ((i * 13) % 10) / 9;
        s.scale.setScalar(k);
        s.position.set(x, duneHeight(x, z) + 0.05, z);
        s.rotation.set(i * 0.7, i * 2.1, i * 0.3);
        s.castShadow = s.receiveShadow = true;
        scene.add(s);
      }

      // ── the path, the enclave, the chains ──────────────────────────────
      const pathPts = [
        new THREE.Vector3(-30, 0, -14), new THREE.Vector3(-19, 0, -5), new THREE.Vector3(-10, 0, 3),
        new THREE.Vector3(-4, 0, 5), new THREE.Vector3(0.6, 0, 3.2),
      ].map((p) => new THREE.Vector3(p.x, duneHeight(p.x, p.z) + 0.02, p.z));
      const path = new THREE.CatmullRomCurve3(pathPts);
      // Packed sand where the sign-ins travel: a pale, smooth strip.
      const road = new THREE.Mesh(
        new THREE.TubeGeometry(path, 120, 0.45, 8, false),
        new THREE.MeshStandardMaterial({ color: 0xead6b2, roughness: 0.85 }),
      );
      road.scale.y = 0.12;
      road.position.y = 0.04;
      road.receiveShadow = true;
      scene.add(road);

      const enclavePos = new THREE.Vector3(2.4, duneHeight(2.4, 2.6) + 1.25, 2.6);
      const enclave = new THREE.Group();
      const shell = new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15 });
      const box = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2.4, 1, 1, 1), shell);
      box.castShadow = box.receiveShadow = true;
      enclave.add(box);
      const seamMat = new THREE.MeshPhysicalMaterial({ color: 0xd9a52b, metalness: 1, roughness: 0.22, emissive: 0x7a4f00, emissiveIntensity: 0.4 });
      for (const y of [-0.4, 0.4]) {
        const seam = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.07, 2.44), seamMat);
        seam.position.y = y;
        enclave.add(seam);
      }
      const lock = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 12, 32, Math.PI), seamMat);
      lock.position.set(0, 0.55, 1.23);
      enclave.add(lock);
      enclave.position.copy(enclavePos);
      scene.add(enclave);

      const chainColours = [0x627eea, 0x9945ff, 0xeb0029];
      const pedestals = chainColours.map((col, i) => {
        const x = 7.4 + i * 1.9, z = -2.8 - i * 0.6;
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.72, 0.86, 0.9, 32),
          new THREE.MeshPhysicalMaterial({ color: 0xefe9de, roughness: 0.4, clearcoat: 0.6 }),
        );
        base.position.set(x, duneHeight(x, z) + 0.4, z);
        base.castShadow = base.receiveShadow = true;
        scene.add(base);
        const gem = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.42, 0),
          new THREE.MeshPhysicalMaterial({ color: col, metalness: 0.1, roughness: 0.08, clearcoat: 1, emissive: col, emissiveIntensity: 0.15 }),
        );
        gem.position.set(x, base.position.y + 1.05, z);
        gem.castShadow = true;
        scene.add(gem);
        return { gem, top: base.position.clone().setY(base.position.y + 0.55) };
      });

      // ── travellers ─────────────────────────────────────────────────────
      const providers = [0x4285f4, 0xd9a52b, 0x1b1a17, 0x34a853];
      const tileGeo = new THREE.BoxGeometry(0.9, 0.2, 0.6);
      const dotGeo = new THREE.CylinderGeometry(0.13, 0.13, 0.05, 16);
      const tileMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 0.8 });
      const tiles = Array.from({ length: 7 }, (_, i) => {
        const g = new THREE.Group();
        const body = new THREE.Mesh(tileGeo, tileMat);
        body.castShadow = true;
        const dot = new THREE.Mesh(dotGeo, new THREE.MeshStandardMaterial({ color: providers[i % providers.length], roughness: 0.4 }));
        dot.position.set(-0.22, 0.12, 0);
        g.add(body, dot);
        scene.add(g);
        return { g, offset: i / 7 };
      });
      const coinGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 40);
      const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xe8b64a, metalness: 1, roughness: 0.18 });
      const coins = Array.from({ length: 6 }, (_, i) => {
        const m = new THREE.Mesh(coinGeo, goldMat);
        m.castShadow = true;
        m.visible = false;
        scene.add(m);
        return { m, to: i % 3, t0: -10 };
      });

      // ── sizing, input, loop ────────────────────────────────────────────
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / Math.max(1, h);
        camera.fov = w < 700 ? 44 : 30;
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
      const frame = () => {
        const dt = Math.min(clock.getDelta(), 0.05);
        t += dt;
        mouse.x += (mouse.tx - mouse.x) * (1 - Math.exp(-dt * 3));
        mouse.y += (mouse.ty - mouse.y) * (1 - Math.exp(-dt * 3));

        const speed = 0.045;
        tiles.forEach((tile) => {
          const u = (t * speed + tile.offset) % 1;
          path.getPointAt(u, tmp);
          tile.g.position.set(tmp.x, tmp.y + 0.26 + Math.sin(t * 3 + tile.offset * 9) * 0.025, tmp.z);
          path.getTangentAt(u, tmp);
          tile.g.rotation.y = Math.atan2(tmp.x, tmp.z) + Math.PI / 2;
          const s = u > 0.94 ? (1 - u) / 0.06 : u < 0.04 ? u / 0.04 : 1;
          tile.g.scale.setScalar(Math.max(0.001, s));
        });
        const arrivals = Math.floor(t * speed * 7);
        if (arrivals !== lastArrival) {
          lastArrival = arrivals;
          const coin = coins[arrivals % coins.length]!;
          coin.t0 = t;
          coin.to = arrivals % 3;
        }
        coins.forEach((coin) => {
          const k = (t - coin.t0) / 1.8;
          coin.m.visible = k >= 0 && k <= 1;
          if (!coin.m.visible) return;
          const target = pedestals[coin.to]!.top;
          coin.m.position.set(
            enclavePos.x + (target.x - enclavePos.x) * k,
            enclavePos.y + 1.1 + (target.y + 0.8 - enclavePos.y - 1.1) * k + Math.sin(k * Math.PI) * 3,
            enclavePos.z + (target.z - enclavePos.z) * k,
          );
          coin.m.rotation.set(Math.PI / 2, 0, t * 6);
        });
        pedestals.forEach((p, i) => {
          p.gem.rotation.y = t * 0.8 + i;
          p.gem.position.y = p.top.y + 0.5 + Math.sin(t * 1.6 + i) * 0.12;
        });
        enclave.rotation.y = Math.sin(t * 0.4) * 0.12 - 0.35;
        seamMat.emissiveIntensity = 0.4 + Math.sin(t * 2.4) * 0.2;

        // Low and far back, looking over the land: the world fills the lower
        // half and the sky above stays clear for the headline.
        camera.position.set(-1.5 + mouse.x * 1.4 + Math.sin(t * 0.07) * 0.6, 7.4 - mouse.y * 0.5, 33);
        camera.lookAt(2, 4.4, -4);
        sun.target.position.set(2, 0, -2);
        renderer.render(scene, camera);
      };

      if (reduce) {
        t = 6;
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
          const m = o as InstanceType<typeof THREE.Mesh>;
          m.geometry?.dispose?.();
          const mat = m.material as InstanceType<typeof THREE.Material> | undefined;
          mat?.dispose?.();
        });
        ripples.dispose();
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
