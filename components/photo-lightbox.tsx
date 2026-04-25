"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

/**
 * Minimal click-to-enlarge lightbox for the photo timeline. Renders a
 * modal with the full-resolution image, click backdrop or press
 * Escape to dismiss. Lock body scroll while open so the page behind
 * doesn't drift. Portal to document.body so containing rounded /
 * overflow-clipped frames don't clip the modal.
 */
export function PhotoLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      className="fixed inset-0 z-[80] flex animate-[tour-card_220ms_cubic-bezier(0.22,1,0.36,1)] items-center justify-center bg-stone-950/85 px-4 py-10 backdrop-blur-sm"
    >
      <button
        type="button"
        aria-label="Close photo"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-stone-900/40 text-white/80 backdrop-blur transition-colors hover:border-white/70 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}
