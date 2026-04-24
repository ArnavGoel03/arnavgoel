export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl py-12 text-center sm:py-16">
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400">
          {eyebrow}
        </p>
      )}
      <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl dark:text-stone-100">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
          {description}
        </p>
      )}
    </div>
  );
}
