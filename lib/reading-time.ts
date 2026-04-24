/**
 * Average adult reading speed is 200 to 250 words per minute for
 * non-technical prose; 220 is the standard middle ground used on
 * Medium, Substack, etc.
 */
const WORDS_PER_MINUTE = 220;

/** Count words in a markdown/MDX body, ignoring code fences and inline code. */
function countWords(body: string): number {
  const stripped = body
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links (keep link text)
    .replace(/[#*_>~]+/g, " "); // markdown markers
  const words = stripped.match(/\b[\w'-]+\b/g);
  return words ? words.length : 0;
}

/** Rounded-up minutes of reading time, floor of 1. */
export function readingTime(body: string): number {
  const words = countWords(body);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(body: string): string {
  const m = readingTime(body);
  return `${m} min read`;
}
