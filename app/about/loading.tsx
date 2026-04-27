export default function AboutLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <div className="mb-8 h-3 w-32 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="h-20 w-3/4 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-10 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      </div>
      <div className="mt-14 h-7 w-40 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
      <div className="mt-6 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-stone-100 dark:bg-stone-800/60" />
      </div>
    </div>
  );
}
