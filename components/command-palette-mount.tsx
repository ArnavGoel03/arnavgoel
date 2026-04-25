import { buildSearchIndex } from "@/lib/search-index";
import { CommandPaletteLazy } from "./command-palette-lazy";

/**
 * Server wrapper that builds the search index at render time (it reads
 * MDX frontmatter via fs) and hands it to the lazy client loader. The
 * index is small (~25 KB JSON for ~120 items) but the palette
 * component itself plus its keyboard / fuzz / scroll logic is closer
 * to 10 KB of JS — `CommandPaletteLazy` dynamically imports that code
 * only after the first ⌘K / palette:open event so the initial bundle
 * stays small on routes that never open search.
 */
export function CommandPaletteMount() {
  const items = buildSearchIndex();
  return <CommandPaletteLazy items={items} />;
}
