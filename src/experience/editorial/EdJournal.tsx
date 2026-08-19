import { JournalIndex, type JournalPost } from "./JournalIndex";

const BLOG_URL = "https://blog.vibestarter.xyz";
const MAX_POSTS = 4;

/** decode the handful of entities the blog's static HTML actually emits */
function decodeEntities(s: string): string {
  return s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/**
 * The blog ships no feed, so the index is read straight off its homepage
 * HTML: every post card is an <a href="/slug"> holding a cover image, an
 * h2/h3 title and a y/m/d date. The parse is deliberately loose — any card
 * it can't read is skipped, and an unreachable page yields [] (the section
 * simply doesn't render rather than ever breaking the landing).
 */
async function fetchPosts(): Promise<JournalPost[]> {
  try {
    const res = await fetch(BLOG_URL, { next: { revalidate: 1800 } });
    if (!res.ok) return [];
    const html = (await res.text()).split(/<body/i)[1] ?? "";

    const posts: JournalPost[] = [];
    const seen = new Set<string>();
    const anchorRe = /<a\b[^>]*href="(\/(?!_next)[a-z0-9][a-z0-9-]*)"[^>]*>([\s\S]*?)<\/a>/gi;

    for (const [, slug, inner] of html.matchAll(anchorRe)) {
      if (seen.has(slug)) continue;

      const titleMatch = inner.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/i);
      const dateMatch = inner.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
      if (!titleMatch || !dateMatch) continue;

      const title = stripTags(titleMatch[1]);
      if (!title) continue;

      const coverMatch = inner.match(/<img[^>]*src="([^"]+)"/i);
      const coverSrc = coverMatch?.[1] ?? "";
      const cover = coverSrc
        ? coverSrc.startsWith("http")
          ? coverSrc
          : `${BLOG_URL}${coverSrc}`
        : undefined;

      const [, y, m, d] = dateMatch;
      seen.add(slug);
      posts.push({
        href: `${BLOG_URL}${slug}`,
        title,
        cover,
        date: `${y}.${m.padStart(2, "0")}.${d.padStart(2, "0")}`,
      });
      if (posts.length >= MAX_POSTS) break;
    }
    return posts;
  } catch {
    return [];
  }
}

/** Quiet strip after the closer: the latest dispatches, read live from the blog. */
export async function EdJournal() {
  const posts = await fetchPosts();
  if (posts.length === 0) return null;
  return <JournalIndex posts={posts} blogUrl={BLOG_URL} />;
}
