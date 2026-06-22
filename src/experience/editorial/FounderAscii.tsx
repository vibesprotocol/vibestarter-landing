"use client";

/**
 * The founder identity, rendered the way the reference (ASCII & Dither Lab) does
 * it — a real 3D model passed through three.js's ASCII renderer so it reads as a
 * living field of monospace characters and dither, green-on-black. The model is a
 * classical marble BUST (Poly Haven, CC0) — sculptural, not a portrait of a real
 * person — that gently turns so the dither is always alive. __step is the
 * hidden-window driver hook; reduced motion paints one static frame once loaded.
 * No setState, ever.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - addon ships without bundled types in this three build
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - addon ships without bundled types in this three build
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type AsciiHost = HTMLDivElement & { __step?: (dt: number) => void };

export function FounderAscii({
  className = "block h-[480px] w-full max-w-[420px] overflow-hidden",
  resolution = 0.11,
  sway = 0.34,
  raw = false,
}: { className?: string; resolution?: number; sway?: number; raw?: boolean } = {}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const W = host.clientWidth || 420;
    const H = host.clientHeight || 480;

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.z = 4.0;

    // VERY high, near-flat lighting: the whole bust sits in the bright half of
    // the ramp so EVERY cell on it maps to a dense character (#/%/@) — a solid
    // mass of dither against the empty background — while a gentle key keeps just
    // enough gradient to model the face. (Too much directional contrast drops the
    // shadow side to empty cells and the bust dissolves.)
    // Dim, low-contrast lighting: with invert:false the bust must stay in the dark
    // half of the ramp so it maps to DENSE glyphs (and the transparent background to
    // blank). The normal-ripple from the flow field supplies most of the shading
    // variation, so the lights only need a gentle gradient on top.
    scene.add(new THREE.AmbientLight(0xffffff, 0.32));
    const key = new THREE.DirectionalLight(0xffffff, 0.6);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.22);
    fill.position.set(4, 0, 2);
    scene.add(fill);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // The bust is rendered as a "semi-liquid" form: the surface flows (vertices
    // displaced along a domain-warped noise field), its lit shading ripples (the
    // normal is bent by that same field's gradient) and a strong brightness flow
    // churns the interior — so characters across the whole bust keep morphing, as if
    // the sculpture is constantly transforming, with or without the slow turn. uTime
    // drives it; amplitudes are live-tunable via host.__shimmer to dial in the feel.
    const uTime = { value: 0 };
    const uObjScale = { value: 1 }; // 1 / native model height — set once the gltf loads
    const uDispAmp = { value: 0 };  // surface-flow amplitude, in object units — set on load
    const uNormalAmp = { value: 2.6 }; // how hard the lit shading ripples
    const uShimAmp = { value: 0.4 }; // interior brightness-churn amplitude
    const uFlowSpeed = { value: 1.8 }; // overall flow-evolution speed

    const NOISE_GLSL = `
varying vec3 vObjPos;
uniform float uTime;
uniform float uObjScale;
uniform float uFlowSpeed;
float vsHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vsNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(vsHash(i + vec3(0.,0.,0.)), vsHash(i + vec3(1.,0.,0.)), f.x),
                 mix(vsHash(i + vec3(0.,1.,0.)), vsHash(i + vec3(1.,1.,0.)), f.x), f.y),
             mix(mix(vsHash(i + vec3(0.,0.,1.)), vsHash(i + vec3(1.,0.,1.)), f.x),
                 mix(vsHash(i + vec3(0.,1.,1.)), vsHash(i + vec3(1.,1.,1.)), f.x), f.y), f.z);
}
float vsFbm(vec3 p){ return vsNoise(p) * 0.62 + vsNoise(p * 2.13 + 7.0) * 0.30; }
float vsFlow(vec3 p, float tt){
  vec3 q = vec3(vsFbm(p + vec3(1.3, 0.0, tt * 0.50)),
                vsFbm(p + vec3(0.0, 3.7, tt * 0.42)),
                vsFbm(p + vec3(2.1, 1.1, tt * 0.33)));
  return vsFbm(p + 1.7 * q + vec3(0.0, 0.0, tt * 0.25));
}`;

    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62, metalness: 0 });
    mat.onBeforeCompile = (shader: { uniforms: Record<string, { value: number }>; vertexShader: string; fragmentShader: string }) => {
      shader.uniforms.uTime = uTime;
      shader.uniforms.uObjScale = uObjScale;
      shader.uniforms.uDispAmp = uDispAmp;
      shader.uniforms.uNormalAmp = uNormalAmp;
      shader.uniforms.uShimAmp = uShimAmp;
      shader.uniforms.uFlowSpeed = uFlowSpeed;

      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nuniform float uDispAmp;\nuniform float uNormalAmp;\n" + NOISE_GLSL)
        .replace(
          "#include <beginnormal_vertex>",
          `#include <beginnormal_vertex>
  {
    float vsT = uTime * uFlowSpeed;
    vec3 vsP = position * uObjScale * 2.5;
    float vsD0 = vsFlow(vsP, vsT);
    float vsE = 0.08;
    vec3 vsGrad = vec3(vsFlow(vsP + vec3(vsE,0.,0.), vsT) - vsD0,
                       vsFlow(vsP + vec3(0.,vsE,0.), vsT) - vsD0,
                       vsFlow(vsP + vec3(0.,0.,vsE), vsT) - vsD0);
    objectNormal = normalize(objectNormal - vsGrad * uNormalAmp);
  }`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
  vObjPos = position * uObjScale;
  transformed += objectNormal * (vsFlow(vObjPos * 2.5, uTime * uFlowSpeed) - 0.45) * uDispAmp;`
        );

      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nuniform float uShimAmp;\n" + NOISE_GLSL)
        .replace(
          "#include <dithering_fragment>",
          `#include <dithering_fragment>
  float vsLum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
  float vsChurn = (vsFlow(vObjPos * 3.5, uTime * uFlowSpeed + 11.0) - 0.5) * uShimAmp;
  // monochrome luminance only — glyph density comes from this, colour from the CSS
  // gradient clipped over the text (see the AsciiEffect display styling).
  gl_FragColor.rgb = vec3(clamp(vsLum + vsChurn, 0.0, 1.0));`
        );
    };
    let loaded = false;

    // display: the ASCII/dither pass (default) or the raw lit 3D render (raw=true,
    // for diagnosing the underlying model without the effect on top)
    // A wide, varied ramp (light → dense) so the morphing field cycles through many
    // distinct glyphs, not just a handful. color:true takes each character's colour
    // from the rendered pixel (our flowing palette); invert:true maps the now-bright
    // bust to the dense end of the ramp and leaves the empty background blank.
    const CHARSET = " .,:;-~=+iclvozxnuJCYUXZO0Qmwqpdbkhao*#MW&8%B@";
    const effect = raw ? null : new AsciiEffect(renderer, CHARSET, { invert: false, resolution });
    let displayEl: HTMLElement;
    if (effect) {
      effect.setSize(W, H);
      const e = effect.domElement as HTMLDivElement;
      // Colour WITHOUT per-character spans (those froze the browser): render the
      // glyphs monochrome and clip them out of an animated brand gradient, so the
      // whole field flows green↔blue↔persimmon for the cost of one CSS animation.
      e.style.backgroundImage =
        "linear-gradient(115deg, #0D8BCA 0%, #91D982 28%, #EC6800 50%, #91D982 72%, #0D8BCA 100%)";
      e.style.backgroundSize = "300% 100%";
      e.style.webkitBackgroundClip = "text";
      e.style.backgroundClip = "text";
      e.style.color = "transparent";
      (e.style as unknown as { webkitTextFillColor: string }).webkitTextFillColor = "transparent";
      e.style.backgroundColor = "transparent";
      e.style.fontFamily = "var(--font-mono), monospace";
      if (!reduced) {
        if (!document.getElementById("vs-hue-kf")) {
          const st = document.createElement("style");
          st.id = "vs-hue-kf";
          st.textContent =
            "@keyframes vsHueShift{from{background-position:0% 0}to{background-position:300% 0}}";
          document.head.appendChild(st);
        }
        e.style.animation = "vsHueShift 9s linear infinite";
      }
      displayEl = e;
    } else {
      renderer.domElement.style.display = "block";
      displayEl = renderer.domElement;
    }
    host.appendChild(displayEl);
    const renderFrame = () => (effect ? effect.render(scene, camera) : renderer.render(scene, camera));

    const loader = new GLTFLoader();
    loader.load(
      "/models/bust.gltf",
      (gltf: { scene: THREE.Object3D }) => {
        const bust = gltf.scene;
        bust.traverse((o: THREE.Object3D) => {
          const m = o as THREE.Mesh;
          if (m.isMesh) m.material = mat;
        });
        // centre + scale to a consistent height, then lift so the head sits near
        // the frame centre and the chest crops at the bottom
        const box = new THREE.Box3().setFromObject(bust);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        // Centre the bust at its own origin, then scale the HOLDER — not the bust.
        // Scaling the bust directly leaves the -center offset un-scaled, which shoves
        // the crown out the top of the frame; scaling the parent keeps it centred.
        bust.position.sub(center);
        uObjScale.value = 1 / (size.y || 1); // normalise the shimmer-noise domain to the model height
        uDispAmp.value = 0.05 * (size.y || 1); // surface flow ~5% of the model height
        const holder = new THREE.Group();
        holder.add(bust);
        const s = 2.3 / (size.y || 1);
        holder.scale.setScalar(s);
        holder.position.y = 0; // whole bust centred: crown clears the top, pedestal clears the bottom
        pivot.add(holder);
        loaded = true;
        if (reduced) {
          pivot.rotation.y = -0.28;
          renderFrame();
        }
      },
      undefined,
      () => {
        loaded = false;
      }
    );

    // a classical bust isn't symmetric, so keep it mostly face-on — a small sway
    // and nod so the lit gradient shifts and the dither stays alive
    let t = 0;
    const step = (dt: number) => {
      t += dt; // always advance, so the dither keeps morphing even when the bust is still
      uTime.value = t;
      if (loaded) {
        pivot.rotation.y = Math.sin(t * 0.4) * sway;
        pivot.rotation.x = Math.sin(t * 0.31) * (sway > 0 ? 0.06 : 0);
      }
      renderFrame();
    };
    (host as AsciiHost).__step = step;
    (host as unknown as { __shimmer?: unknown }).__shimmer = { uDispAmp, uNormalAmp, uShimAmp, uFlowSpeed, uTime };

    let inView = true;
    const io = new IntersectionObserver(([entry]) => {
      inView = entry?.isIntersecting ?? true;
    });
    io.observe(host);

    let raf = 0;
    let disposed = false;
    if (!reduced) {
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
      if (effect) effect.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (reduced) renderFrame();
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      delete (host as AsciiHost).__step;
      pivot.traverse((o: THREE.Object3D) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry?.dispose();
      });
      mat.dispose();
      renderer.dispose();
      if (displayEl.parentElement === host) host.removeChild(displayEl);
    };
  }, []);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="The founder's identity rendered as a slowly turning classical marble bust, drawn live in a field of green ASCII and dither characters — a constantly shifting on-chain presence."
      className={className}
    />
  );
}
