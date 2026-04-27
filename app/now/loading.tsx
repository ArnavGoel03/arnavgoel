export default function NowLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-8 h-3 w-28 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-20 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-6 h-5 w-3/4 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      <div className="mt-16 space-y-14">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="mb-5 h-8 w-48 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
