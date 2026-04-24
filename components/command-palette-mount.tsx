import { buildSearchIndex } from "@/lib/search-index";
import { CommandPalette } from "./command-palette";

/**
 * Server wrapper that builds the search index at render time (it reads
 * MDX frontmatter via fs) and hands it to the client palette. Included
 * in the root layout so ⌘K works from every page.
 */
export function CommandPaletteMount() {
  const items = buildSearchIndex();
  return <CommandPalette items={items} />;
}
