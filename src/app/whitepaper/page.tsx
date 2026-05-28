import { readFile } from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whitepaper — Vibestarter',
  description:
    'The Vibestarter whitepaper: design treatment of the vibecoin funding primitive, mechanism, contract system, and trust model.',
};

// Content is auto-synced from the private app repo's docs/whitepaper/ directory
// by .github/workflows/sync-public-docs.yml (over there). Don't edit these
// files directly — edits will be overwritten on the next sync.
const CONTENT_DIR = path.join(process.cwd(), 'content', 'whitepaper');

// Slug = TOC anchor + URL fragment. Title = TOC label.
// Index doc is rendered first as a meta-intro; the 14 numbered files follow.
const SECTIONS: Array<{ slug: string; file: string; title: string }> = [
  { slug: 'index', file: '_index.md', title: 'Introduction' },
  { slug: 'executive-summary', file: '01-executive-summary.md', title: '1. Executive Summary' },
  { slug: 'funding-mismatch', file: '02-funding-mismatch.md', title: '2. The Funding Mismatch' },
  { slug: 'vibecoins-as-primitive', file: '03-vibecoins-as-primitive.md', title: '3. Vibecoins as a Primitive' },
  { slug: 'design-goals', file: '04-design-goals.md', title: '4. Design Goals' },
  { slug: 'time-released-funding', file: '05-time-released-funding.md', title: '5. Time-Released Funding' },
  { slug: 'challenge-windows', file: '06-challenge-windows.md', title: '6. Challenge Windows' },
  { slug: 'liquidity-lp-lock', file: '07-liquidity-lp-lock.md', title: '7. Liquidity & LP Lock' },
  { slug: 'reputation', file: '08-reputation.md', title: '8. Reputation' },
  { slug: 'economics-examples', file: '09-economics-examples.md', title: '9. Economics: Worked Examples' },
  { slug: 'contract-architecture', file: '10-contract-architecture.md', title: '10. Contract Architecture' },
  { slug: 'trust-safety', file: '11-trust-safety.md', title: '11. Trust & Safety' },
  { slug: 'governance', file: '12-governance.md', title: '12. Governance' },
  { slug: 'risks-disclosures', file: '13-risks-disclosures.md', title: '13. Risks & Disclosures' },
  { slug: 'appendix', file: '14-appendix.md', title: '14. Appendix' },
];

async function loadSection(file: string): Promise<string> {
  try {
    return await readFile(path.join(CONTENT_DIR, file), 'utf-8');
  } catch (err) {
    return `> ⚠ Failed to load \`${file}\`: ${(err as Error).message}. Sync from app repo may not have run yet.`;
  }
}

export default async function WhitepaperPage() {
  const sections = await Promise.all(
    SECTIONS.map(async (s) => ({ ...s, content: await loadSection(s.file) }))
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header — matches /thesis */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-[#0A0A0A]/90 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-[0.14em]">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 32 32" fill="none">
              <path
                d="M4 8L14 16L4 24"
                stroke="#91D982"
                strokeWidth="3"
                strokeLinecap="square"
                strokeLinejoin="miter"
              />
              <path d="M16 24H28" stroke="#91D982" strokeWidth="3" strokeLinecap="square" />
            </svg>
            <span className="font-semibold text-sm sm:text-[15px] tracking-tight">Vibestarter</span>
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          {/* Title block */}
          <div className="max-w-3xl lg:ml-[288px] mb-12">
            <span className="text-accent text-sm font-mono mb-4 block">// WHITEPAPER · DRAFT v1</span>
            <h1 className="text-3xl sm:text-4xl font-semibold mb-3">Vibestarter Whitepaper</h1>
            <p className="text-muted text-lg">
              Design treatment of the vibecoin funding primitive — mechanism, contract system, trust model.
            </p>
          </div>

          {/* TOC + content */}
          <div className="grid lg:grid-cols-[240px_1fr] gap-12">
            {/* TOC sidebar (desktop only — mobile uses inline anchor list above content) */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent mb-4">
                  // CONTENTS
                </div>
                <nav className="space-y-1 text-sm">
                  {SECTIONS.map((s) => (
                    <a
                      key={s.slug}
                      href={`#${s.slug}`}
                      className="block text-muted hover:text-white transition-colors py-1"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="min-w-0">
              {/* Mobile-only inline TOC */}
              <details className="lg:hidden mb-8 border border-border rounded-lg overflow-hidden">
                <summary className="px-4 py-3 text-xs font-mono uppercase tracking-[0.3em] text-accent cursor-pointer hover:bg-white/[0.02]">
                  // CONTENTS
                </summary>
                <nav className="px-4 py-2 space-y-1 text-sm border-t border-border">
                  {SECTIONS.map((s) => (
                    <a
                      key={s.slug}
                      href={`#${s.slug}`}
                      className="block text-muted hover:text-white transition-colors py-1"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </details>

              {/* Content — each section gets its own anchor wrapper */}
              <article className="max-w-3xl">
                {sections.map((s) => (
                  <section
                    key={s.slug}
                    id={s.slug}
                    className="prose prose-invert max-w-none mb-20 scroll-mt-24
                               prose-headings:font-display prose-headings:tracking-tight
                               prose-h1:text-2xl prose-h1:mt-0 prose-h1:mb-6
                               prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
                               prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-2
                               prose-p:text-muted prose-p:leading-relaxed
                               prose-strong:text-white
                               prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                               prose-blockquote:border-l-accent/40 prose-blockquote:bg-white/[0.02]
                               prose-blockquote:rounded-r-lg prose-blockquote:py-1 prose-blockquote:px-5
                               prose-blockquote:not-italic prose-blockquote:font-normal
                               prose-blockquote:text-muted
                               prose-code:text-accent-bright prose-code:bg-white/[0.04]
                               prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                               prose-code:before:content-none prose-code:after:content-none
                               prose-li:text-muted prose-li:my-1
                               prose-table:text-sm prose-table:my-6
                               prose-th:text-white prose-th:font-mono prose-th:font-medium
                               prose-th:text-xs prose-th:uppercase prose-th:tracking-wider
                               prose-td:text-muted prose-td:border-border
                               prose-hr:border-border"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
                      {s.content}
                    </ReactMarkdown>
                  </section>
                ))}
              </article>
            </div>
          </div>

          {/* Footer link */}
          <div className="max-w-3xl lg:ml-[288px] mt-12 pt-8 border-t border-border">
            <Link href="/" className="text-muted hover:text-white transition-colors text-sm">
              &larr; Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
