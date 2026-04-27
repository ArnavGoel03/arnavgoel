export default function RoutineLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="mb-8 h-3 w-36 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-20 w-72 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-16 divide-y divide-stone-200 border-t border-stone-300 dark:divide-stone-800 dark:border-stone-800">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-baseline gap-6 py-8">
            <div className="hidden w-14 shrink-0 sm:block">
              <div className="h-3 w-8 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-8 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
