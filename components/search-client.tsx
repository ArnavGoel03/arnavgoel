"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Mic, Search as SearchIcon } from "lucide-react";
import type { SearchItem, SearchItemType } from "@/lib/search-index";
import { cn } from "@/lib/utils";

// Minimal SpeechRecognition typings. The DOM lib doesn't ship them; we
// only touch the surface we use.
type SpeechResult = { transcript: string };
type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<SpeechResult> & { isFinal: boolean }>;
  resultIndex: number;
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const TYPE_FILTERS: { id: "all" | SearchItemType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "review", label: "Reviews" },
  { id: "primer", label: "Primers" },
  { id: "note", label: "Notes" },
];

function score(item: SearchItem, terms: string[]): number {
  if (terms.length === 0) return 0;
  let s = 0;
  for (const t of terms) {
    if (!item.haystack.includes(t)) return 0;
    // Title matches weigh more than body matches.
    if (item.title.toLowerCase().includes(t)) s += 3;
    if (item.subtitle.toLowerCase().includes(t)) s += 2;
    s += 1;
  }
  return s;
}

export function SearchClient({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | SearchItemType>("all");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // `/` focuses search, like GitHub.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/") return;
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setVoiceSupported(getSpeechRecognition() !== null);
    return () => recognitionRef.current?.abort();
  }, []);

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Ctor = getSpeechRecognition();
    if (!Ctor) return;
    const rec = new Ctor();
    // Single utterance with live interim updates: feels closer to a
    // dictation field than waiting for a final transcript at the end.
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let transcript = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setQuery(transcript.trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }

  const results = useMemo(() => {
    const terms = deferred
      .toLowerCase()
      .split(/\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const base = type === "all" ? items : items.filter((i) => i.type === type);
    if (terms.length === 0) return base;
    return base
      .map((item) => ({ item, s: score(item, terms) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .map(({ item }) => item);
  }, [items, deferred, type]);

  return (
    <div className="space-y-8">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            listening ? "Listening…" : "Search reviews, primers, notes…"
          }
          className={cn(
            "w-full rounded-full border bg-white py-4 pl-14 font-serif text-xl italic text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100 dark:bg-stone-900",
            voiceSupported ? "pr-16" : "pr-5",
            listening
              ? "border-rose-400 dark:border-rose-400"
              : "border-stone-200 focus:border-stone-900 dark:border-stone-800",
          )}
          type="search"
          aria-label="Search"
        />
        <kbd
          className={cn(
            "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10px] text-stone-500 sm:inline dark:text-stone-400 dark:border-stone-800 dark:bg-stone-900",
            voiceSupported ? "right-16" : "right-5",
          )}
        >
          /
        </kbd>
        {voiceSupported && (
          <button
            type="button"
            onClick={toggleVoice}
            aria-label={listening ? "Stop voice search" : "Start voice search"}
            aria-pressed={listening}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              listening
                ? "bg-rose-500 text-white shadow-[0_0_0_4px_rgba(244,63,94,0.18)] animate-pulse"
                : "text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:text-stone-500 dark:hover:bg-stone-800 dark:hover:text-stone-200",
            )}
          >
            <Mic className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setType(f.id)}
            className={cn(
              "rounded-full border px-3 py-1 transition-colors",
              type === f.id
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900",
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto flex items-center text-xs text-stone-400 dark:text-stone-500">
          {results.length} {results.length === 1 ? "result" : "results"}
        </span>
      </div>

      {results.length === 0 ? (
        <p className="py-16 text-center font-serif text-lg italic text-stone-500 dark:text-stone-400">
          {query.trim()
            ? `Nothing matches "${query}".`
            : "Start typing to find something."}
        </p>
      ) : (
        <ol className="divide-y divide-stone-100 border-t border-stone-200 dark:border-stone-800 dark:divide-stone-800">
          {results.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex items-baseline justify-between gap-4 py-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                    {item.subtitle}
                  </p>
                  <h3 className="mt-0.5 font-serif text-xl text-stone-900 transition-colors group-hover:text-rose-700 sm:text-2xl dark:text-stone-100">
                    {item.title}
                  </h3>
                </div>
                {item.verdict && (
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] italic text-stone-400 dark:text-stone-500">
                    {item.verdict}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
