"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Copies the current page's canonical URL to the clipboard. Shows a
 * short "Copied" confirmation (1.5s) via state. Fails silently on
 * browsers without clipboard access (rare, but possible in iframes).
 */
export function CopyLink({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url =
      typeof window === "undefined"
        ? path
        : new URL(path, window.location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Old Safari / permission-denied in iframes. Just no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Link copied" : "Copy link"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-400 dark:hover:text-stone-100",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600" />
      ) : (
        <LinkIcon className="h-3 w-3" />
      )}
      <span>{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}
