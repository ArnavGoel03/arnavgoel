import { ArrowUpRight } from "lucide-react";
import type { Social } from "@/lib/socials";

export function SocialLink({ social }: { social: Social }) {
  const Icon = social.icon;
  const isExternal = social.href.startsWith("http");
  return (
    <a
      href={social.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition-colors group-hover:bg-stone-900 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="font-medium text-stone-900">{social.label}</div>
          <div className="text-sm text-stone-500">{social.handle}</div>
        </div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-stone-400 transition-colors group-hover:text-stone-900" />
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
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-700 transition-colors hover:border-stone-900 hover:bg-stone-900 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}
