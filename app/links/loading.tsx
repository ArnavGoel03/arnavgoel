export default function LinksLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-8 h-3 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-20 w-64 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-12 divide-y divide-stone-200 border-y border-stone-200 dark:divide-stone-800 dark:border-stone-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 py-5">
            <div className="h-8 w-8 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-48 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
