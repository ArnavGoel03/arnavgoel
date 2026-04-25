import { ArrowUpRight } from "lucide-react";
import type { Social } from "@/lib/socials";

export function SocialLink({
  social,
  index,
}: {
  social: Social;
  index?: number;
}) {
  const Icon = social.icon;
  const isExternal = social.href.startsWith("http");
  return (
    <a
      href={social.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex items-baseline gap-6 py-6"
    >
      {index !== undefined && (
        <span className="hidden w-10 shrink-0 font-mono text-xs text-stone-400 tabular-nums sm:inline-block dark:text-stone-500">
          №&nbsp;{String(index).padStart(2, "0")}
        </span>
      )}
      <div
        className={
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white transition-colors group-hover:border-stone-900 group-hover:bg-stone-900 dark:border-stone-800 dark:bg-stone-900 " +
          (social.iconColor ?? "text-stone-700 dark:text-stone-300") +
          " group-hover:!text-white"
        }
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-2xl leading-tight tracking-tight text-stone-900 transition-colors group-hover:text-rose-700 dark:group-hover:text-rose-400 sm:text-3xl dark:text-stone-100">
          {social.label}
        </h3>
        <p className="mt-1 font-serif italic text-stone-600 dark:text-stone-300">{social.handle}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 self-center text-stone-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-900 dark:text-stone-500" />
    </a>
  );
}

export function SocialIconLink({ social }: { social: Social }) {
  const Icon = social.icon;
  const isExternal = social.href.startsWith("http");
  return (
    <a
      href={social.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      aria-label={social.label}
      title={social.label}
      className={
        "flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white transition-colors hover:border-stone-900 hover:bg-stone-900 hover:!text-white dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-400 " +
        (social.iconColor ?? "text-stone-700 dark:text-stone-300")
      }
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
