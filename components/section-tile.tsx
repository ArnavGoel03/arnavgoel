import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionTile({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between gap-6 rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm sm:p-8"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          {eyebrow}
        </p>
        <h3 className="mt-3 font-serif text-2xl text-stone-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          {description}
        </p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-stone-400 transition-colors group-hover:text-stone-900" />
    </Link>
  );
}
