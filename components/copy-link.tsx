"use client";

import { useState } from "react";
import { Check, Link as LinkIcon, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Share or copy the current page's canonical URL.
 *
 *   - On mobile-ish devices where `navigator.share` is available, opens
 *     the OS share sheet.
 *   - Otherwise falls back to writing the URL to the clipboard and
 *     showing a 1.5s "Copied" confirmation.
 *   - Fails silently if both paths are unavailable (Safari in an iframe,
 *     permission-denied clipboards).
 */
export function CopyLink({
  path,
  title,
  className,
}: {
  path: string;
  title?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url =
      typeof window === "undefined"
        ? path
        : new URL(path, window.location.origin).toString();

    // Prefer the native share sheet when we're likely on mobile.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ url, title });
        return;
      } catch {
        // User dismissed the sheet, or share failed. Fall through to
        // clipboard so the button still feels useful.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Old Safari / permission-denied. No-op.
    }
  }

  const hasNativeShare =
    typeof navigator !== "undefined" && "share" in navigator;

  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Link copied" : "Share this page"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-stone-500 transition-colors hover:border-stone-900 hover:text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-400 dark:hover:text-stone-100",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
      ) : hasNativeShare ? (
        <Share2 className="h-3 w-3" />
      ) : (
        <LinkIcon className="h-3 w-3" />
      )}
      <span>{copied ? "Copied" : hasNativeShare ? "Share" : "Copy link"}</span>
    </button>
  );
}
