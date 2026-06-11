"use client";

import { TextScramble } from "./TextScramble";

interface SectionHeaderProps {
  num: string;
  label: string;
  title: string;
  description?: string;
  badge?: string;
}

/**
 * Editorial document-style section header: mono index label, large
 * left-aligned display heading, and a huge outlined section numeral
 * in the right margin. One system for every section.
 */
export function SectionHeader({ num, label, title, description, badge }: SectionHeaderProps) {
  return (
    <div className="relative mb-10 sm:mb-14">
      <div className="flex items-start justify-between gap-8">
        <div className="max-w-3xl min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="section-label">
              {num} // {label}
            </span>
            {badge && (
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-accent/80 bg-accent/10 border border-accent/20">
                {badge}
              </span>
            )}
          </div>
          <TextScramble text={title} className="heading-editorial" />
          {description && (
            <p className="text-muted text-base sm:text-lg max-w-2xl font-sans font-light leading-relaxed mt-5">
              {description}
            </p>
          )}
        </div>
        <span aria-hidden="true" className="ghost-num hidden md:block shrink-0 mt-1">
          {num}
        </span>
      </div>
    </div>
  );
}
