"use client";

/**
 * THE GAP as a real 3D scatter — a Magic-Quadrant grown a third axis.
 *
 * Three axes: TIME (x, slow→fast), TRUST (y, low→high), TERMS for the founder
 * (z, bad→good). Every route is a point at its (time, trust, terms) coordinate
 * inside a wireframe cube with a floor grid. A DROP-LINE falls from each point to
 * the floor so you can read its ground position AND its height — the cue that
 * makes a 3D scatter legible when still. VIBESTARTER is the lit hero alone in the
 * fast + high-trust + good-terms corner: the only point that wins on all three.
 *
 * Depth resolves through SCROLL — __scroll(p) turns the cube ~36° as the section
 * passes, so the third axis reveals itself without a mouse or an auto-spin. Crisp
 * HTML labels are projected from each point every frame so they never warp.
 * __step(dt) advances + renders (hidden-tab driver). Reduced motion paints one
 * static, readable frame. No setState, ever.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import * as THREE from "three";

const GREEN = "#91D982";
const PERSIMMON = "#EC6800";

type Route = {
  id: string;
  name: string;
  note: string;
  time: number; // 0..1  slow → fast   (x)
  trust: number; // 0..1  low → high    (y)
  terms: number; // 0..1  bad → good    (z)
  mark: string | null;
  off: [number, number]; // label pixel offset from the projected point
  align: "left" | "right";
  vibe?: boolean;
};

const ROUTES: readonly Route[] = [
  { id: "grants", name: "GRANTS · ACCELERATORS", note: "slow · high trust · ok terms", time: 0.18, trust: 0.78, terms: 0.5, mark: null, off: [14, -8], align: "left" },
  { id: "vc", name: "VENTURE CAPITAL", note: "slow · high trust · bad terms", time: 0.28, trust: 0.84, terms: 0.18, mark: null, off: [14, -8], align: "left" },
  { id: "kick", name: "KICKSTARTER", note: "all-or-nothing", time: 0.5, trust: 0.4, terms: 0.5, mark: null, off: [14, -8], align: "left" },
  { id: "ico", name: "ICO", note: "raise upfront, vanish", time: 0.82, trust: 0.2, terms: 0.45, mark: "✗", off: [14, -8], align: "left" },
  { id: "pads", name: "TOKEN LAUNCHPADS", note: "good terms, no trust", time: 0.95, trust: 0.12, terms: 0.82, mark: "✗", off: [-14, 10], align: "right" },
  { id: "vibe", name: "VIBESTARTER", note: "fast · high trust · good terms", time: 0.88, trust: 0.9, terms: 0.9, mark: null, off: [16, -10], align: "left", vibe: true },
] as const;

// data 0..1 → cube space -1..1
const toCube = (v: number) => v * 2 - 1;

type Plot3DHost = HTMLDivElement & {
  __step?: (dt: number) => void;
  __scroll?: (p: number) => void;
};

export function Gap3D({ className = "absolute inset-0" }: { className?: string } = {}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const layer = layerRef.current;
    if (!host || !layer) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = host.clientWidth || 960;
    let H = host.clientHeight || 580;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.display = "block";
    host.insertBefore(renderer.domElement, layer);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, W / H, 0.1, 100);
    camera.position.set(2.75, 1.75, 3.35);
    camera.lookAt(0, -0.05, 0);

    // pivot holds the whole cube; scroll turns it around Y
    const pivot = new THREE.Group();
    scene.add(pivot);

    // --- wireframe cube (faint) ---
    const cube = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 })
    );
    pivot.add(cube);

    // --- floor grid at y = -1 ---
    const grid = new THREE.GridHelper(2, 8, 0x91d982, 0xffffff);
    grid.position.y = -1;
    const gm = grid.material as THREE.Material | THREE.Material[];
    (Array.isArray(gm) ? gm : [gm]).forEach((m) => {
      m.transparent = true;
      m.opacity = 0.1;
    });
    pivot.add(grid);

    // --- the three axis edges, brighter, from the (slow,low,bad) corner ---
    const axisMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 });
    const o = new THREE.Vector3(-1, -1, -1);
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      o, new THREE.Vector3(1, -1, -1), // TIME (x)
      o, new THREE.Vector3(-1, 1, -1), // TRUST (y)
      o, new THREE.Vector3(-1, -1, 1), // TERMS (z)
    ]);
    pivot.add(new THREE.LineSegments(axisGeo, axisMat));

    // --- points, drop-lines, floor feet ---
    const dropMatBase = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22 });
    const dropMatVibe = new THREE.LineBasicMaterial({ color: 0x91d982, transparent: true, opacity: 0.5 });
    const sphereWhite = new THREE.MeshBasicMaterial({ color: 0xd6ddd7 });
    const sphereVibe = new THREE.MeshBasicMaterial({ color: 0x91d982 });

    type Tracked = { mesh: THREE.Object3D; route: Route };
    const tracked: Tracked[] = [];

    ROUTES.forEach((r) => {
      const p = new THREE.Vector3(toCube(r.time), toCube(r.trust), toCube(r.terms));
      const vibe = !!r.vibe;

      const mesh = new THREE.Mesh(new THREE.SphereGeometry(vibe ? 0.075 : 0.045, 18, 18), vibe ? sphereVibe : sphereWhite);
      mesh.position.copy(p);
      pivot.add(mesh);

      if (vibe) {
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: 0x91d982, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
        glow.scale.setScalar(0.5);
        mesh.add(glow);
      }

      // drop-line to the floor + a foot tick
      const drop = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([p, new THREE.Vector3(p.x, -1, p.z)]),
        vibe ? dropMatVibe : dropMatBase
      );
      pivot.add(drop);
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), vibe ? sphereVibe : sphereWhite);
      foot.position.set(p.x, -1, p.z);
      pivot.add(foot);

      tracked.push({ mesh, route: r });
    });

    // --- collect the HTML label + axis-label elements ---
    const labelEls = new Map<string, HTMLElement>();
    layer.querySelectorAll<HTMLElement>("[data-g3-label]").forEach((el) => labelEls.set(el.dataset.g3Label!, el));
    const axisEls = new Map<string, HTMLElement>();
    layer.querySelectorAll<HTMLElement>("[data-g3-axis]").forEach((el) => axisEls.set(el.dataset.g3Axis!, el));
    // axis label anchors in cube space (just outside their edge midpoints)
    const axisAnchors: Record<string, THREE.Vector3> = {
      time: new THREE.Vector3(0.2, -1.16, -1.16),
      trust: new THREE.Vector3(-1.2, 0.2, -1.16),
      terms: new THREE.Vector3(-1.16, -1.16, 0.25),
    };

    const ndc = new THREE.Vector3();
    const place = (el: HTMLElement | undefined, world: THREE.Vector3, offX: number, offY: number) => {
      if (!el) return;
      ndc.copy(world).project(camera);
      if (ndc.z > 1) {
        el.style.opacity = "0";
        return;
      }
      const x = (ndc.x * 0.5 + 0.5) * W + offX;
      const y = (-ndc.y * 0.5 + 0.5) * H + offY;
      el.style.transform = `translate(${x}px, ${y}px)`;
      el.style.opacity = "1";
    };

    let scrollP = 0.5;
    const BASE_ROT = -0.16;
    const ROT_RANGE = 0.62; // ~±18° → 36° sweep over the scroll
    const worldTmp = new THREE.Vector3();

    const projectAll = () => {
      tracked.forEach((t) => {
        t.mesh.getWorldPosition(worldTmp);
        place(labelEls.get(t.route.id), worldTmp, t.route.off[0], t.route.off[1]);
      });
      Object.entries(axisAnchors).forEach(([k, v]) => {
        worldTmp.copy(v).applyMatrix4(pivot.matrixWorld);
        place(axisEls.get(k), worldTmp, 0, 0);
      });
    };

    const step = (_dt: number) => {
      pivot.rotation.y = BASE_ROT + (scrollP - 0.5) * ROT_RANGE;
      pivot.updateMatrixWorld();
      renderer.render(scene, camera);
      projectAll();
    };
    (host as Plot3DHost).__step = step;
    (host as Plot3DHost).__scroll = (p: number) => {
      scrollP = Math.max(0, Math.min(1, p));
    };

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    io.observe(host);

    let raf = 0;
    let disposed = false;
    step(0);
    if (!reduced) {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (disposed || document.hidden || !inView) return;
        step(0);
      };
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      W = host.clientWidth || W;
      H = host.clientHeight || H;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      step(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      delete (host as Plot3DHost).__step;
      delete (host as Plot3DHost).__scroll;
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  const labelBase: CSSProperties = { position: "absolute", left: 0, top: 0, opacity: 0, transition: "opacity 0.4s ease", willChange: "transform" };

  return (
    <div ref={hostRef} data-g3-host className={className} style={{ position: "relative" }}>
      <div ref={layerRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {ROUTES.map((r) => {
          const vibe = !!r.vibe;
          return (
            <div
              key={r.id}
              data-g3-label={r.id}
              className="whitespace-nowrap"
              style={{ ...labelBase, textAlign: r.align === "right" ? "right" : "left", transformOrigin: r.align === "right" ? "right top" : "left top", marginLeft: r.align === "right" ? -180 : 0, width: r.align === "right" ? 180 : "auto" }}
            >
              <div className={vibe ? "font-display font-bold" : "font-mono"} style={{ fontSize: vibe ? 16 : 12.5, letterSpacing: vibe ? "0.5px" : "1.4px", color: vibe ? GREEN : "rgba(255,255,255,0.9)" }}>
                {r.mark && <span style={{ color: PERSIMMON, marginRight: 5 }}>{r.mark}</span>}
                {r.name}
              </div>
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.3px", color: vibe ? "rgba(145,217,130,0.72)" : "rgba(255,255,255,0.45)", marginTop: 1 }}>
                {r.note}
              </div>
            </div>
          );
        })}
        <div data-g3-axis="time" className="font-mono" style={{ ...labelBase, fontSize: 11, letterSpacing: "2px", color: "rgba(255,255,255,0.55)" }}>
          TIME →
        </div>
        <div data-g3-axis="trust" className="font-mono" style={{ ...labelBase, fontSize: 11, letterSpacing: "2px", color: "rgba(255,255,255,0.55)" }}>
          TRUST ↑
        </div>
        <div data-g3-axis="terms" className="font-mono" style={{ ...labelBase, fontSize: 11, letterSpacing: "2px", color: "rgba(255,255,255,0.55)" }}>
          TERMS ⟋
        </div>
      </div>
    </div>
  );
}

/** Soft radial sprite for the hero glow. */
function glowTexture(): THREE.Texture {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.4, "rgba(145,217,130,0.5)");
  g.addColorStop(1, "rgba(145,217,130,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}
