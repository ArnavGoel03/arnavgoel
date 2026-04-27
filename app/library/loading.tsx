export default function LibraryLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
      <div className="mb-8 h-3 w-24 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-14 w-44 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-6 h-5 w-3/5 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      <div className="mt-10 flex gap-4">
        <div className="h-8 w-20 animate-pulse rounded-full bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-20 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800/60" />
      </div>
      <div className="mt-8 divide-y divide-stone-100 dark:divide-stone-800">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 py-5">
            <div className="h-14 w-10 shrink-0 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
