"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { FounderAscii } from "./FounderAscii";
import { ChapterHead } from "../ui/ChapterHead";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

/* ===========================================================================
   05 — Reputation. The focal element is a CREDENTIAL LEDGER: an editorial,
   on-chain credential sheet for a single founder. A typographic header
   identifies them; below it a vertical list of reputation signals stamps in
   row by row, each verifying with a mono tick as it lands. To its left the
   founder's likeness renders as a living ASCII/dither bust (FounderAscii) — a
   constantly-shifting glyph field standing in as their on-chain presence.
   A signal, not a gate.
   ========================================================================= */

/** Ethos mark — path verbatim from .claude/assets/ethos.svg (viewBox 0 0 40 40). */
function EthosMark() {
  return (
    <svg viewBox="0 0 40 40" className="w-5 h-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.92 19.96C19.92 21.3282 19.8351 22.6765 19.6703 24H0V32H17.606C16.444 34.8973 14.875 37.5876 12.9697 40H40V32H17.606C18.6188 29.475 19.3225 26.7927 19.6703 24H40V16H19.6801C19.3395 13.208 18.6432 10.5257 17.638 8H40V0H13.0327C14.927 2.4141 16.4855 5.10421 17.638 8H0V16H19.6801C19.8385 17.2978 19.92 18.6194 19.92 19.96Z"
      />
    </svg>
  );
}

/** ENS mark — path verbatim from .claude/assets/ens.svg (viewBox 0 0 24 24). */
function EnsMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M11.725.223 5.107 11.13a.146.146 0 0 1-.237.018c-.583-.692-2.753-3.64-.067-6.327 2.45-2.452 5.572-4.2 6.73-4.804.13-.068.269.08.192.206m-.366 23.747c.132.093.295-.064.206-.2-1.478-2.251-6.392-9.744-7.07-10.869-.67-1.11-1.987-2.953-2.097-4.53-.011-.158-.228-.19-.283-.042a10 10 0 0 0-.27.85c-1.105 4.11.5 8.472 3.985 10.916zm.909-.193 6.618-10.907a.146.146 0 0 1 .237-.018c.582.692 2.753 3.64.067 6.327-2.45 2.452-5.572 4.2-6.73 4.804-.13.068-.269-.08-.192-.206M12.641.028c-.132-.093-.295.065-.206.2 1.478 2.252 6.392 9.745 7.07 10.87.67 1.109 1.987 2.952 2.097 4.53.011.157.228.19.283.041.088-.239.182-.524.27-.85 1.105-4.11-.5-8.472-3.985-10.915z"
      />
    </svg>
  );
}

/** X mark — the simple-icons X path (viewBox 0 0 24 24). */
function XMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
      />
    </svg>
  );
}

/** Typographic mark for the on-chain signal: mono "0x" in a 20px white/30 circle. */
function HexMark() {
  return (
    <span
      aria-hidden="true"
      className="w-5 h-5 shrink-0 rounded-full border border-white/30 inline-flex items-center justify-center"
    >
      <span className="font-mono text-[10px] leading-none text-white/70">0x</span>
    </span>
  );
}

/** Track-record mark: the schedule's station diamond — a 9px rotate-45 green-bordered diamond. */
function StationMark() {
  return (
    <span
      aria-hidden="true"
      className="w-5 h-5 shrink-0 inline-flex items-center justify-center"
    >
      <span className="block w-[9px] h-[9px] rotate-45 border border-accent" />
    </span>
  );
}

type SignalRow = {
  /** Stable key. */
  k: string;
  /** 20px monochrome logo (real, inlined verbatim) or typographic mark. */
  mark: ReactNode;
  /** Mono eyebrow label. */
  label: string;
  /** The credential value (font-display). */
  value: string;
  /** Trailing sans note. */
  note: string;
  /** Numeric values scramble up on enter; non-numeric resolve plainly. */
  scramble?: boolean;
};

const ROWS: readonly SignalRow[] = [
  {
    k: "ethos",
    mark: (
      <span className="text-white/70">
        <EthosMark />
      </span>
    ),
    label: "Ethos score",
    value: "1,624",
    note: "vouches, reviews & slashes — expensive to fake",
    scramble: true,
  },
  {
    k: "ens",
    mark: (
      <span className="text-white/70">
        <EnsMark />
      </span>
    ),
    label: "ENS identity",
    value: "loomwright.eth",
    note: "human-readable, owned on-chain",
  },
  {
    k: "x",
    mark: (
      <span className="text-white/70">
        <XMark />
      </span>
    ),
    label: "Social identity",
    value: "@loom · 4.1k",
    note: "public voice — receipts, not promises",
  },
  {
    k: "history",
    mark: <HexMark />,
    label: "On-chain history",
    value: "3.2 YRS",
    note: "wallet age & activity, verifiable by anyone",
    scramble: true,
  },
  {
    k: "track",
    mark: <StationMark />,
    label: "Track record",
    value: "2 / 2",
    note: "every past raise and how it ended",
    scramble: true,
  },
] as const;

/**
 * 05 — Reputation. The founder's standing is rendered as an editorial on-chain
 * credential ledger beside a living ASCII/dither bust (FounderAscii). On scroll
 * the header reveals, then each signal row stamps in from below and verifies
 * with a small mono tick — the credential coming into focus line by line beside
 * the founder's constantly-shifting likeness. Reduced motion paints the full
 * ledger at rest and a single static frame of the bust. A signal, not a gate.
 */
export function EdReputation() {
  const sectionRef = useRef<HTMLElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ledger = ledgerRef.current;
    if (!section || !ledger) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Complete final readable state: every row + tick visible, no animation.
      // The bust paints a single static frame in reduced mode (see FounderAscii).
      gsap.set("[data-rep-row]", { opacity: 1, y: 0 });
      gsap.set("[data-rep-tick]", { opacity: 1 });
      gsap.set("[data-rep-in]", { opacity: 1, y: 0 });
      return;
    }

    const gctx = gsap.context(() => {
      // --- initial states ---
      gsap.set("[data-rep-row]", { opacity: 0, y: 14 });
      gsap.set("[data-rep-tick]", { opacity: 0 });

      // --- copy + header reveals ---
      gsap.fromTo(
        "[data-rep-in]",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
        }
      );

      // --- the ledger stamps in: each signal row settles, then its tick ticks
      //     on — the credential verifying line by line, beside the founder's
      //     self-animating ASCII bust. Row + tick live in a reversible timeline
      //     so they re-stamp on scroll-back.
      const rows = gsap.utils.toArray<HTMLElement>("[data-rep-row]", ledger);

      const stamp = gsap.timeline({
        scrollTrigger: { trigger: ledger, start: "top 78%", toggleActions: "play none none reverse" },
      });

      rows.forEach((row, i) => {
        const at = i * 0.12;
        stamp.to(row, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, at);

        const tick = row.querySelector<HTMLElement>("[data-rep-tick]");
        if (tick) stamp.to(tick, { opacity: 1, duration: 0.3, ease: "power1.out" }, at + 0.32);
      });

      // --- the numeric figures scramble up ONCE, in step with their row. Kept
      //     in a once:true timeline (not the reversible stamp) so a scroll-back
      //     never reverses the scramble and leaves a figure garbled. The final
      //     text always equals data-value, so the figures are correct at rest.
      const scramble = gsap.timeline({
        scrollTrigger: { trigger: ledger, start: "top 78%", once: true },
      });
      rows.forEach((row, i) => {
        const value = row.querySelector<HTMLElement>("[data-rep-scramble]");
        if (!value) return;
        const target = value.dataset.value ?? value.textContent ?? "";
        scramble.to(
          value,
          { duration: 0.5, ease: "none", scrambleText: { text: target, chars: "0123456789/", speed: 1.2 } },
          i * 0.12 + 0.12
        );
      });
    }, section);

    return () => gctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-chapter="05" data-chapter-name="Reputation" className="relative py-16 sm:py-32 px-5 sm:px-10 border-t border-white/[0.08]">
      <div className="max-w-[1500px] mx-auto">
        {/* focal */}
        <ChapterHead index="05" name="Reputation" className="mb-6" />
        <h2
          data-rep-in
          data-skew
          className="font-display font-bold tracking-[-0.04em] leading-[0.98] text-[clamp(40px,6.4vw,96px)] text-white"
        >
          KNOW WHO YOU&apos;RE <span className="text-accent">backing.</span>
        </h2>
        <p data-rep-in className="mt-6 max-w-[560px] text-muted font-sans font-light text-[15px] sm:text-base leading-relaxed">
          Speculative platforms run on anonymous promises. Every Vibestarter raise page
          surfaces the founder behind it — their history, their record, their standing —
          before a single wei moves.
        </p>

        {/* Focal pairing: the founder's living ASCII/dither bust on the left, the
            on-chain credential ledger on the right. The bust is a constantly-
            shifting glyph field — an alive on-chain presence — beside the record
            that verifies row by row. */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center gap-8 sm:gap-12 lg:flex-row lg:items-center lg:justify-center lg:gap-16">
          {/* the founder, rendered as a living ASCII bust */}
          <div data-rep-in className="shrink-0">
            <FounderAscii
              resolution={0.2}
              sway={0.22}
              className="block h-[300px] w-[252px] sm:h-[520px] sm:w-[440px] max-w-full overflow-hidden"
            />
          </div>

          {/* the credential ledger — an on-chain credential sheet for one founder */}
          <div
            ref={ledgerRef}
            className="w-full max-w-[680px]"
            role="group"
            aria-label="On-chain credential ledger for the founder loomwright.eth"
          >
            {/* HEADER ROW — typographic identity */}
            <div
              data-rep-in
              className="flex items-end justify-between gap-6 pb-5 border-b border-white/[0.12]"
            >
              <div className="min-w-0">
                <p className="font-display font-bold leading-[0.95] text-[clamp(22px,2.6vw,34px)] text-white">
                  loomwright.eth
                </p>
                <p className="mt-1.5 font-mono text-[11px] text-white/40">0x7F3A…E4B2</p>
              </div>
              <p className="shrink-0 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.24em] uppercase text-accent whitespace-nowrap">
                <span aria-hidden="true">✓</span>
                <span>Verified on-chain</span>
              </p>
            </div>

            {/* SIGNAL ROWS — each verifies with a tick as it stamps in.
                Layout: an explicit, non-overlapping grid so the value column and
                the note can NEVER collide at any viewport.
                  ≥sm columns:  [logo auto] [label 168px] [value 240px nowrap] [note 1fr] [tick auto]
                The value column (240px) clears "loomwright.eth" at the clamp
                ceiling — 14 chars × 0.6em × 26px = 218.4px — with whitespace-nowrap,
                and the note begins only after the full 240px column (a ≥21.6px gap).
                Below sm the grid collapses to a single stacked column. */}
            <ul>
              {ROWS.map((r) => (
                <li
                  key={r.k}
                  data-rep-row
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 border-b border-white/[0.07] py-3.5 sm:grid-cols-[auto_168px_240px_minmax(0,1fr)_auto] sm:gap-x-4 sm:py-5"
                >
                  {/* logo */}
                  <span className="shrink-0 w-5 h-5 inline-flex items-center justify-center">
                    {r.mark}
                  </span>

                  {/* label — fixed 168px column */}
                  <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/40 whitespace-nowrap overflow-hidden text-ellipsis">
                    {r.label}
                  </span>

                  {/* value — fixed 240px column, nowrap; sized so the widest
                      value ("loomwright.eth") clears the 26px clamp ceiling and
                      the note can never cross into it */}
                  {r.scramble ? (
                    <span
                      data-rep-scramble
                      data-value={r.value}
                      className="block font-display font-bold text-[clamp(18px,2vw,26px)] leading-none text-white whitespace-nowrap"
                    >
                      {r.value}
                    </span>
                  ) : (
                    <span className="block font-display font-bold text-[clamp(18px,2vw,26px)] leading-none text-white whitespace-nowrap">
                      {r.value}
                    </span>
                  )}

                  {/* note — flexible 1fr column, min-w-0 so it wraps inside its
                      own track instead of pushing into the value column. Phones
                      run the row as a one-liner, so the note is desktop-only */}
                  <span className="hidden sm:block min-w-0 font-sans text-[12.5px] leading-snug text-white/45">
                    {r.note}
                  </span>

                  {/* the verifying tick at the row's right edge */}
                  <span
                    data-rep-tick
                    aria-hidden="true"
                    className="shrink-0 justify-self-end font-mono text-[12px] text-accent"
                  >
                    ✓
                  </span>
                </li>
              ))}
            </ul>

            <p data-rep-in className="mt-4 font-mono text-[10px] tracking-[0.16em] uppercase text-white/30">
              A signal, not a gate — anyone can back, launches are reviewed against a published
              rubric, and everyone can see exactly who they&apos;re dealing with.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
