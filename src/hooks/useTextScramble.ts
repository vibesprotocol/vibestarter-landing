"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const SCRAMBLE_CHARS = "@#$%&*!?><{}[]=/\\|~^0123456789";

// How many frames of scrambling before each character resolves
const SCRAMBLE_CYCLES = 2;
// Ms between each cycle tick
const CYCLE_SPEED = 30;

interface UseTextScrambleOptions {
  duration?: number;
  trigger?: boolean;
}

export interface CharState {
  char: string;
  state: "hidden" | "scrambling" | "resolved";
}

export function useTextScramble(text: string, options: UseTextScrambleOptions = {}) {
  const { trigger = false } = options;
  const [chars, setChars] = useState<CharState[]>(() =>
    text.split("").map((char) => ({
      char,
      state: char === " " ? "resolved" : "hidden",
    }))
  );
  const [resolved, setResolved] = useState(false);
  const hasAnimated = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scramble = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const textChars = text.split("");
    let cursor = 0;
    let cyclesLeft = SCRAMBLE_CYCLES;

    const tick = () => {
      // Skip spaces
      while (cursor < textChars.length && textChars[cursor] === " ") {
        cursor++;
        cyclesLeft = SCRAMBLE_CYCLES;
      }

      if (cursor >= textChars.length) {
        setChars(textChars.map((c) => ({ char: c, state: "resolved" })));
        setResolved(true);
        return;
      }

      if (cyclesLeft > 0) {
        // Show scramble char at cursor
        const scrambleChar = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        setChars(
          textChars.map((c, i) => {
            if (c === " ") return { char: c, state: "resolved" };
            if (i < cursor) return { char: c, state: "resolved" };
            if (i === cursor) return { char: scrambleChar, state: "scrambling" };
            return { char: c, state: "hidden" };
          })
        );
        cyclesLeft--;
        timerRef.current = setTimeout(tick, CYCLE_SPEED);
      } else {
        // Lock in character and advance
        cursor++;
        cyclesLeft = SCRAMBLE_CYCLES;
        setChars(
          textChars.map((c, i) => {
            if (c === " ") return { char: c, state: "resolved" };
            if (i < cursor) return { char: c, state: "resolved" };
            return { char: c, state: "hidden" };
          })
        );
        timerRef.current = setTimeout(tick, CYCLE_SPEED);
      }
    };

    tick();
  }, [text]);

  useEffect(() => {
    if (trigger && !hasAnimated.current) scramble();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [trigger, scramble]);

  // Backward compat
  const displayText = chars.map((c) => (c.state === "hidden" ? "" : c.char)).join("");

  return { displayText, chars, resolved };
}
