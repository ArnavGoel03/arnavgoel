import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200/70 py-14 text-sm text-stone-500">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl italic text-stone-700">
              {site.shortName}
            </span>
            <span aria-hidden className="text-rose-400">❋</span>
            <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400">
              est. 2026
            </span>
          </div>
          <p className="text-stone-500">
            <span className="text-stone-400">Yash by night.</span>{" "}
            <a
              href={site.professionalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-900"
            >
              Arnav by day
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-200/70 pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-stone-400">
            Some buy links here are affiliate links — clicking through and
            purchasing may earn me a small commission at no extra cost to you.
            Reviews and ratings are based entirely on my own use; nothing on
            this site is paid placement.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
