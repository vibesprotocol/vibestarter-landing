"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTextScramble } from "@/hooks/useTextScramble";

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  duration?: number;
}

export function TextScramble({
  text,
  className = "",
  as: Tag = "h2",
  duration = 800,
}: TextScrambleProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  const displayText = useTextScramble(text, { trigger: isVisible, duration });

  return (
    <div ref={ref}>
      <Tag className={className}>
        <span className="font-mono">{displayText}</span>
      </Tag>
    </div>
  );
}
