"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { SearchItem } from "@/lib/search-index";

type PaletteModule = { CommandPalette: ComponentType<{ items: SearchItem[] }> };

/**
 * Tiny client shim that listens for the two palette triggers (⌘/Ctrl+K
 * and the `palette:open` custom event from the header search button)
 * and only then dynamically imports the real CommandPalette. Saves the
 * palette's component bundle from the critical path on every route the
 * user never opens search on.
 *
 * Once loaded, the real palette stays mounted and handles its own
 * open/close state, so subsequent triggers don't re-import.
 */
export function CommandPaletteLazy({ items }: { items: SearchItem[] }) {
  const [Palette, setPalette] = useState<
    ComponentType<{ items: SearchItem[] }> | null
  >(null);

  useEffect(() => {
    let cancelled = false;
    let imported = false;

    const importPalette = async (alsoOpen: boolean) => {
      if (imported) return;
      imported = true;
      const mod = (await import("./command-palette")) as PaletteModule;
      if (cancelled) return;
      setPalette(() => mod.CommandPalette);
      // The real palette listens for `palette:open` itself. Re-fire on
      // the next tick so its mount-time effect has the listener wired
      // before we trigger it.
      if (alsoOpen) {
        requestAnimationFrame(() => {
          window.dispatchEvent(new Event("palette:open"));
        });
      }
    };

    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        void importPalette(true);
      }
    }
    function onOpen() {
      void importPalette(true);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  if (!Palette) return null;
  return <Palette items={items} />;
}
