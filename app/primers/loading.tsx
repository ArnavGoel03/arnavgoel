export default function PrimersLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="mb-8 h-3 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-20 w-56 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-16 space-y-14 border-t border-stone-300 pt-10 dark:border-stone-800">
        {[1, 2].map((g) => (
          <div key={g}>
            <div className="mb-6 h-10 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-baseline gap-6 py-6">
                  <div className="flex-1 space-y-2">
                    <div className="h-7 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
