import Link from "next/link";
import { ArrowRight } from "lucide-react";

const agents = [
  "Claude Code",
  "Cursor",
  "IdeaRalph",
];

export function Agents() {
  return (
    <section id="agents" className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Agents become part of the token&apos;s origin story.
          </h2>
          <p className="text-muted text-base sm:text-lg leading-relaxed mb-8">
            Track what builders ship with: {agents.join(", ")}, and more — with provenance attached at launch.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors text-[14px] font-medium"
          >
            Explore agent models
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
