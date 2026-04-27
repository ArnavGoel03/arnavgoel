export default function HomeLoading() {
  return (
    <div>
      <div className="border-b border-stone-300 bg-stone-50 dark:border-stone-800 dark:bg-stone-950">
        <div className="mx-auto max-w-6xl px-4 pt-12 pb-20 sm:pt-16 sm:pb-28">
          <div className="mb-10 h-3 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          <div className="h-24 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          <div className="mt-8 h-6 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
          <div className="mt-10 flex gap-8 border-y border-stone-200 py-5 dark:border-stone-800">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-stone-200 p-5 dark:border-stone-800">
              <div className="h-40 w-full animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800/60" />
              <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
