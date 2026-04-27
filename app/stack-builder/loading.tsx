export default function StackBuilderLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <div className="mb-8 h-3 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-14 w-64 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-6 h-5 w-3/4 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      <div className="mt-10 rounded-xl border border-stone-200 p-6 dark:border-stone-800">
        <div className="h-10 w-full animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800/60" />
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-stone-100 dark:bg-stone-800/60" />
          ))}
        </div>
      </div>
    </div>
  );
}
