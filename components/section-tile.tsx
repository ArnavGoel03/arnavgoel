import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionTile({
  href,
  eyebrow,
  title,
  description,
  index,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between gap-6 rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-stone-400 hover:shadow-sm sm:p-7"
    >
      <div>
        <div className="mb-4 flex items-baseline justify-between text-[10px] uppercase tracking-[0.22em] text-stone-400">
          {index !== undefined ? (
            <span className="font-mono">№ {String(index).padStart(2, "0")}</span>
          ) : (
            <span aria-hidden className="text-rose-400">❋</span>
          )}
          <span>{eyebrow}</span>
        </div>
        <h3 className="font-serif text-3xl leading-[1.05] tracking-tight text-stone-900">
          {title}
          <span className="text-rose-400">.</span>
        </h3>
        <p className="mt-3 font-serif text-base italic leading-relaxed text-stone-600">
          {description}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-stone-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-900" />
    </Link>
  );
}
