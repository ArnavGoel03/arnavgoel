/**
 * Tiny client-side toast helper. Anywhere in a "use client" file, call
 *
 *   import { toast } from "@/lib/toast";
 *   toast("Saved");
 *   toast("Could not save", { tone: "error" });
 *   toast("Sticky note", { duration: 0 });
 *
 * Server components / route handlers can import this safely; the
 * function no-ops when there's no window.
 */
type Tone = "success" | "info" | "error";

export function toast(
  message: string,
  opts: { tone?: Tone; duration?: number } = {},
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("toast", {
      detail: { message, tone: opts.tone ?? "success", duration: opts.duration },
    }),
  );
}
