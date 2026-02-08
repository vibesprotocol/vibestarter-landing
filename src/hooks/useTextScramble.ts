"use client";

import { useEffect, useState, useRef, useCallback } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

interface UseTextScrambleOptions {
  duration?: number;
  trigger?: boolean;
}

export function useTextScramble(text: string, options: UseTextScrambleOptions = {}) {
  const { duration = 800, trigger = false } = options;
  const [displayText, setDisplayText] = useState(text);
  const [resolved, setResolved] = useState(false);
  const hasAnimated = useRef(false);
  const frameRef = useRef<number>(0);

  const scramble = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const chars = text.split("");

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const resolvedCount = Math.floor(progress * chars.length);

      const result = chars.map((char, i) => {
        if (char === " ") return " ";
        if (i < resolvedCount) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplayText(result.join(""));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setResolved(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [text, duration]);

  useEffect(() => {
    if (trigger && !hasAnimated.current) scramble();
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, scramble]);

  return { displayText, resolved };
}
