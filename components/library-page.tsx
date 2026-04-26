import type { LibraryItem } from "@/lib/library";
import { Container } from "@/components/container";

const RATING_LABEL: Record<NonNullable<LibraryItem["rating"]>, string> = {
  loved: "loved",
  liked: "liked",
  okay: "okay",
  skip: "skip",
};

const RATING_COLOR: Record<NonNullable<LibraryItem["rating"]>, string> = {
  loved: "text-emerald-700 dark:text-emerald-400",
  liked: "text-stone-700 dark:text-stone-300",
  okay: "text-amber-700 dark:text-amber-400",
  skip: "text-rose-600 dark:text-rose-400",
};

function Section({
  label,
  items,
  showDate,
}: {
  label: string;
  items: LibraryItem[];
  showDate: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mb-14">
      <h2 className="mb-6 border-b border-stone-200 pb-3 font-display text-3xl font-light tracking-tight text-stone-900 dark:border-stone-800 dark:text-stone-100">
        {label}
      </h2>
      <ul className="space-y-8">
        {items.map((it, i) => (
          <li key={`${it.title}-${i}`} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                {it.link ? (
                  <a
                    href={it.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-stone-300 underline-offset-4 transition-colors hover:decoration-rose-400 dark:decoration-stone-700"
                  >
                    {it.title}
                  </a>
                ) : (
                  it.title
                )}
              </h3>
              {it.rating && (
                <span
                  className={
                    "font-mono text-[10px] uppercase tracking-[0.2em] " +
                    RATING_COLOR[it.rating]
                  }
                >
                  ❋ {RATING_LABEL[it.rating]}
                </span>
              )}
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-stone-400 dark:text-stone-500">
              by {it.by}
              {showDate && it.date && (
                <span className="text-stone-300 dark:text-stone-700"> · {it.date}</span>
              )}
            </p>
            {it.note && (
              <p className="font-serif text-base italic leading-relaxed text-stone-700 dark:text-stone-300">
                {it.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LibraryPage({
  eyebrow,
  title,
  subtitle,
  intro,
  items,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  items: LibraryItem[];
}) {
  const current = items.filter((i) => i.status === "current");
  const finished = items
    .filter((i) => i.status === "finished")
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const abandoned = items.filter((i) => i.status === "abandoned");

  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <div className="mb-8 flex items-baseline justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
        <span className="flex items-baseline gap-2">
          <span className="text-rose-400">❋</span>
          <span>{eyebrow}</span>
        </span>
      </div>

      <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-stone-900 sm:text-6xl dark:text-stone-100">
        {title}
        <span className="text-rose-400">.</span>
      </h1>
      <p className="mt-6 max-w-2xl font-serif text-lg italic leading-snug text-stone-600 sm:text-xl dark:text-stone-300">
        {subtitle}
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        {intro}
      </p>

      <div className="mt-16">
        <Section label="Currently" items={current} showDate />
        <Section label="Finished" items={finished} showDate />
        <Section label="Abandoned" items={abandoned} showDate={false} />
      </div>
    </Container>
  );
}
