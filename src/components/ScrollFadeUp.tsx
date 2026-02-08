"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollFadeUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollFadeUp({
  children,
  className = "",
  delay = 0,
}: ScrollFadeUpProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? "visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
