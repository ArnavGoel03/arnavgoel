import { slugifyHeading } from "@/lib/utils";

type Heading = { level: 2 | 3; text: string; id: string };

function extractHeadings(body: string): Heading[] {
  const out: Heading[] = [];
  const lines = body.split("\n");
  let inCodeFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].trim();
    out.push({ level, text, id: slugifyHeading(text) });
  }
  return out;
}

/**
 * Sticky contents rail. Shows on the left gutter on wide screens,
 * collapses to a compact block at the top of the article on mobile
 * (via the caller controlling layout).
 */
export function TocNav({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  const headings = extractHeadings(body);
  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={className}
    >
      <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="mr-1.5 text-rose-400">❋</span>
        Contents
      </p>
      <ol className="space-y-2 text-sm">
        {headings.map((h) => (
          <li
            key={h.id}
            className={h.level === 3 ? "pl-4 text-xs" : ""}
          >
            <a
              href={`#${h.id}`}
              className="text-stone-500 transition-colors hover:text-rose-700 dark:text-stone-400 dark:hover:text-rose-400"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
