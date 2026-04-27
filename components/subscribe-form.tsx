"use client";

import { useId, useState } from "react";
import { toast } from "@/lib/toast";

/**
 * Email-subscription form, two flavors:
 *   - variant="inline"  -> compact one-line affordance for the footer
 *   - variant="block"   -> centered card for /subscribe and /now
 *
 * Posts to /api/subscribe. The API stores the address in
 * content/_subscribers.json via a GitHub commit; double-opt-in via
 * Resend wires up later (the form does not assume confirmation in this
 * version, so the success state reads "On the list" not "Check your
 * email" until the email leg ships).
 */
export function SubscribeForm({
  variant = "inline",
  source,
}: {
  variant?: "inline" | "block";
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputId = useId();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("That email looks off. Try again.");
      setState("error");
      return;
    }
    setState("sending");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          source: source ?? "site",
          companion: honeypot,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        setErrorMsg(j?.error || `Subscribe failed (${res.status}).`);
        setState("error");
        return;
      }
      setState("ok");
      setEmail("");
      toast("Subscribed");
    } catch (err) {
      const msg = (err as Error).message;
      setErrorMsg(msg);
      setState("error");
      toast(msg || "Could not subscribe", { tone: "error" });
    }
  }

  if (state === "ok") {
    if (variant === "block") {
      return (
        <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center font-serif italic text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
          On the list. Next review hits your inbox the day it ships.
          <span className="ml-1 text-rose-400" aria-hidden>
            ❋
          </span>
        </div>
      );
    }
    return (
      <p className="font-serif text-sm italic text-stone-500 dark:text-stone-400">
        On the list.{" "}
        <span className="text-rose-400" aria-hidden>
          ❋
        </span>
      </p>
    );
  }

  // text-base (16px) on the input is intentional: any smaller font on
  // an <input> triggers an automatic zoom-on-focus on iOS Safari, which
  // makes the form jump under the user's finger. Don't drop below it.
  const baseInput =
    "rounded-full border border-stone-200 bg-white px-4 py-2 text-base text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500";
  const baseButton =
    "rounded-full bg-stone-900 px-5 py-2 text-sm text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:disabled:bg-stone-700 dark:disabled:text-stone-400";

  if (variant === "block") {
    return (
      <form
        onSubmit={submit}
        aria-label="Subscribe to new reviews"
        className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900"
      >
        <p className="mb-4 font-serif text-base italic text-stone-700 dark:text-stone-300">
          New reviews land roughly once a week. No tracking, no upsells, no
          forwarded PR pitches. Unsubscribe in one click.
        </p>
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
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={inputId}
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={"flex-1 " + baseInput}
          />
          <button
            type="submit"
            disabled={state === "sending"}
            className={baseButton}
          >
            {state === "sending" ? "Sending..." : "Subscribe"}
          </button>
        </div>
        {state === "error" && errorMsg && (
          <p
            role="alert"
            className="mt-3 text-xs italic text-rose-600 dark:text-rose-400"
          >
            {errorMsg}
          </p>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      aria-label="Subscribe to new reviews"
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
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
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        required
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={"min-w-0 sm:w-64 " + baseInput}
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className={baseButton}
      >
        {state === "sending" ? "..." : "Subscribe"}
      </button>
      {state === "error" && errorMsg && (
        <p
          role="alert"
          className="text-xs italic text-rose-600 sm:ml-2 dark:text-rose-400"
        >
          {errorMsg}
        </p>
      )}
    </form>
  );
}
