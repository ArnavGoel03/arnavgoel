"use client";

import { useEffect } from "react";

/**
 * Per-review scroll-position memory. On mount, if the reader has
 * been here before and was past the first viewport, restore them to
 * within ~100px of where they left off. On every scroll, throttle-
 * save the new position. On unmount or pagehide, do a final save.
 *
 * Stored as a single `yashgoel-continue-v1` JSON object keyed by
 * URL path so the entire site shares one localStorage entry instead
 * of leaking one per review. We trim to the 32 most-recent paths so
 * the entry stays a few KB at most.
 *
 * The restore is silent — no banner, no "resume reading" prompt —
 * because anything louder than the body copy itself would clash with
 * the editorial calm. Returning readers just land where they left.
 */
const KEY = "yashgoel-continue-v1";
const MAX_ENTRIES = 32;
const RESTORE_THRESHOLD_PX = 600;

type Store = Record<string, { y: number; t: number }>;

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as Store;
    return {};
  } catch {
    return {};
  }
}

function writeStore(store: Store) {
  try {
    // Trim to the N most-recent keys.
    const entries = Object.entries(store).sort((a, b) => b[1].t - a[1].t);
    const trimmed = Object.fromEntries(entries.slice(0, MAX_ENTRIES));
    localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // ignore quota errors
  }
}

export function ContinueReading({ path }: { path: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const store = readStore();
    const saved = store[path];

    // Restore. We give the page a beat to lay out (images, MDX
    // hydration) before scrolling, otherwise the y value can be
    // larger than the rendered document at restore time.
    if (saved && saved.y > RESTORE_THRESHOLD_PX) {
      const target = saved.y;
      const tryRestore = () => {
        const docHeight = document.documentElement.scrollHeight;
        if (docHeight - window.innerHeight >= target) {
          window.scrollTo({ top: target, behavior: "auto" });
          return true;
        }
        return false;
      };
      // Try a few times as the page lays out.
      let attempts = 0;
      const id = setInterval(() => {
        attempts++;
        if (tryRestore() || attempts > 20) clearInterval(id);
      }, 80);
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    const save = () => {
      const y = window.scrollY;
      const next = readStore();
      // Don't save trivial scroll positions (headers / first
      // viewport); those would just reset returning readers to the
      // top, which is what we already get for free without memory.
      if (y < RESTORE_THRESHOLD_PX) {
        if (next[path]) {
          delete next[path];
          writeStore(next);
        }
        return;
      }
      next[path] = { y, t: Date.now() };
      writeStore(next);
    };
    const onScroll = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        save();
      }, 400);
    };
    const onLeave = () => {
      if (timer) clearTimeout(timer);
      save();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", onLeave);
      onLeave();
    };
  }, [path]);

  return null;
}
