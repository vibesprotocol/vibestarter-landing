"use client";

/**
 * The 3D space BEHIND the gap graph. A real three.js point cloud spread through a
 * deep volume: perspective size-attenuation makes near motes large and far ones
 * tiny, linear fog fades the deep ones to black, and the whole field drifts slowly
 * toward the camera (wrapping) so the depth is alive without the graph moving. The
 * data points never move — this field is the only thing carrying dimensionality.
 *
 * __step(dt) advances + renders one frame (hidden-tab driver); __scroll(p) feeds
 * the section's scroll progress so the camera parallaxes as you pass. Reduced
 * motion paints a single static — but still deep — frame. No setState, ever.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ParticleHost = HTMLDivElement & {
  __step?: (dt: number) => void;
  __scroll?: (p: number) => void;
};

/** Soft round sprite so each particle is a glowing disc, not a hard square. */
function discTexture(): THREE.Texture {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

export function GapParticles({
  className = "absolute inset-0",
  count = 900,
}: { className?: string; count?: number } = {}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = host.clientWidth || 960;
    const H = host.clientHeight || 580;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(W, H);
    renderer.domElement.style.display = "block";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    // linear fog fades the deep particles to black — the core depth cue
    scene.fog = new THREE.Fog(0x000000, 16, 46);

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 14;

    const SPREAD_X = 26;
    const SPREAD_Y = 16;
    const DEPTH = 34; // z extent of the volume (receding away from camera)
    const NEAR_Z = 1.5; // wrap point just behind the camera plane

    const N = reduced ? Math.min(count, 420) : count;
    const positions = new Float32Array(N * 3);
    const colors = new Float32Array(N * 3);
    const seeds = new Float32Array(N);

    const GREEN = new THREE.Color("#91D982");
    const BLUE = new THREE.Color("#0D8BCA");
    const DIM = new THREE.Color("#36473c"); // dim brand-green dust, the bulk of the field

    for (let i = 0; i < N; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * SPREAD_X;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD_Y;
      positions[i * 3 + 2] = -Math.random() * DEPTH;
      const t = Math.random();
      const c = t > 0.9 ? GREEN : t > 0.78 ? BLUE : DIM;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      seeds[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const sprite = discTexture();
    const mat = new THREE.PointsMaterial({
      size: 0.42,
      sizeAttenuation: true,
      map: sprite,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const pos = geo.attributes.position.array as Float32Array;
    const baseY = camera.position.y;
    let scrollP = 0.5;
    let t = 0;

    const step = (dt: number) => {
      t += dt;
      const flow = dt * 0.55; // slow drift toward the camera
      for (let i = 0; i < N; i++) {
        let z = pos[i * 3 + 2] + flow;
        if (z > NEAR_Z) {
          z -= DEPTH;
          pos[i * 3] = (Math.random() * 2 - 1) * SPREAD_X;
          pos[i * 3 + 1] = (Math.random() * 2 - 1) * SPREAD_Y;
        }
        pos[i * 3 + 2] = z;
        pos[i * 3] += Math.sin(t * 0.18 + seeds[i]) * 0.0025; // faint lateral sway
      }
      geo.attributes.position.needsUpdate = true;
      // scroll parallax: shift + tilt the field as the section passes
      camera.position.y = baseY + (scrollP - 0.5) * 5;
      points.rotation.z = (scrollP - 0.5) * 0.05;
      renderer.render(scene, camera);
    };
    (host as ParticleHost).__step = step;
    (host as ParticleHost).__scroll = (p: number) => {
      scrollP = Math.max(0, Math.min(1, p));
    };

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    io.observe(host);

    let raf = 0;
    let disposed = false;
    if (reduced) {
      step(0); // one static, still-deep frame
    } else {
      let last = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (disposed) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (document.hidden || !inView) return;
        step(dt);
      };
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      const w = host.clientWidth || W;
      const h = host.clientHeight || H;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) step(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      delete (host as ParticleHost).__step;
      delete (host as ParticleHost).__scroll;
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" data-gap-particles className={className} />;
}
