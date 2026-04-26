"use client";

import { useId, useState } from "react";
import { toast } from "@/lib/toast";

/**
 * End-of-article reader-feedback affordance. Not a public comments
 * section — submissions land in a private inbox that only the author
 * can read at /admin/inbox. The ideology: the review reflects one
 * person's experience, but readers may have nuances worth hearing.
 *
 * The UI is deliberately quiet: a single italic line until clicked.
 * No vote counts, no avatars, no thread, no ugly form. Match the
 * editorial voice or it doesn't ship.
 */
export function ReaderNote({
  kind,
  slug,
}: {
  kind: string;
  slug: string;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [name, setName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const noteId = useId();
  const nameId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const trimmed = note.trim();
    if (trimmed.length < 4 || trimmed.length > 2000) {
      setErrorMsg("Notes need to be between 4 and 2000 characters.");
      setState("error");
      return;
    }
    setState("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          slug,
          name: name.trim() || undefined,
          note: trimmed,
          // Bots fill every field, including ones they cannot see.
          companion: honeypot,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErrorMsg(j?.error || `Submit failed (${res.status}).`);
        setState("error");
        return;
      }
      setState("sent");
      setNote("");
      setName("");
      toast("Note sent");
    } catch (err) {
      const msg = (err as Error).message;
      setErrorMsg(msg);
      setState("error");
      toast(msg || "Could not send note", { tone: "error" });
    }
  }

  if (state === "sent") {
    return (
      <p className="border-t border-stone-200 pt-8 font-serif text-sm italic text-stone-500 dark:border-stone-800 dark:text-stone-400">
        Thanks. Read every one.{" "}
        <span className="text-rose-400" aria-hidden>
          ❋
        </span>
      </p>
    );
  }

  if (!open) {
    return (
      <p className="border-t border-stone-200 pt-8 font-serif text-sm italic text-stone-500 dark:border-stone-800 dark:text-stone-400">
        Different experience with this?{" "}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="underline decoration-stone-300 underline-offset-4 transition-colors hover:decoration-rose-400 dark:decoration-stone-700"
        >
          Send me a private note
        </button>
        .
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="border-t border-stone-200 pt-8 dark:border-stone-800"
    >
      <p className="mb-4 font-serif text-sm italic text-stone-500 dark:text-stone-400">
        Goes to my inbox only. Nothing here ever shows up publicly.
      </p>
      {/* Honeypot. Hidden from real users, irresistible to bots. */}
      <label
        className="absolute h-px w-px -translate-x-[9999px] overflow-hidden"
        aria-hidden
      >
        Companion
        <input
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </label>
      <label htmlFor={noteId} className="sr-only">
        Your experience
      </label>
      <textarea
        id={noteId}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Your nuance, a contradicting result, anything I should think about."
        className="w-full resize-y rounded-xl border border-stone-200 bg-white px-3 py-2.5 font-serif text-base leading-relaxed text-stone-900 placeholder:font-sans placeholder:text-sm placeholder:italic placeholder:text-stone-400 focus:border-stone-400 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label htmlFor={nameId} className="sr-only">
          Your name (optional)
        </label>
        <input
          id={nameId}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          placeholder="Your name (optional)"
          className="flex-1 min-w-[180px] rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
        <button
          type="submit"
          disabled={state === "sending" || note.trim().length < 4}
          className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-5 py-2 text-sm text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:disabled:bg-stone-700 dark:disabled:text-stone-400"
        >
          {state === "sending" ? "Sending..." : "Send"}
          <span aria-hidden className="text-rose-400">
            ❋
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setState("idle");
            setErrorMsg(null);
          }}
          className="text-xs text-stone-400 underline-offset-4 transition-colors hover:text-stone-700 hover:underline dark:text-stone-500 dark:hover:text-stone-200"
        >
          Cancel
        </button>
      </div>
      {state === "error" && errorMsg && (
        <p className="mt-3 text-xs italic text-rose-600 dark:text-rose-400">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
