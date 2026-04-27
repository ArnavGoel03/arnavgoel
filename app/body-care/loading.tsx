export default function BodyCareLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="py-12">
        <div className="h-3 w-36 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="mt-4 h-16 w-56 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
        <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      </div>
      <div className="grid grid-cols-1 gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-stone-200 p-5 dark:border-stone-800">
            <div className="h-40 w-full animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800/60" />
            <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
