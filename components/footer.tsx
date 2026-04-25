import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";
import { FooterSearchLink } from "./footer-search-link";
import { SubscribeForm } from "./subscribe-form";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200/70 py-14 text-sm text-stone-500 dark:border-stone-900/40 dark:text-stone-400">
      <Container className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-stone-200/70 pb-6 sm:flex-row sm:items-end sm:justify-between dark:border-stone-900/40">
          <div className="max-w-md">
            <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
              <span className="text-rose-400">❋</span> Stay in the loop
            </p>
            <p className="font-serif text-base italic text-stone-600 dark:text-stone-300">
              One email per published review. No tracking. Unsubscribe in one
              click.
            </p>
          </div>
          <SubscribeForm variant="inline" source="footer" />
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl italic text-stone-700 dark:text-stone-200">
              {site.shortName}
            </span>
            <span aria-hidden className="text-rose-400">❋</span>
            <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
              est. 2026
            </span>
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            <span className="text-stone-400 dark:text-stone-500">Yash by night.</span>{" "}
            <a
              href={site.professionalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-900 dark:text-stone-200 dark:decoration-stone-700 dark:hover:text-stone-50 dark:hover:decoration-stone-300"
            >
              Arnav by day
              <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </p>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-stone-200/70 pt-6 text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:border-stone-900/40 dark:text-stone-500">
          <Link
            href="/?tour=1"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
          >
            Take the tour
          </Link>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <FooterSearchLink />
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <a
            href="/issue"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
          >
            Archive
          </a>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <a
            href="/retired"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
          >
            Retired
          </a>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <a
            href="/links"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
          >
            Links
          </a>
          <span className="text-stone-300 dark:text-stone-700">·</span>
          <a
            href="/feed.xml"
            className="transition-colors hover:text-stone-700 dark:hover:text-stone-200"
          >
            RSS
          </a>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-200/70 pt-6 dark:border-stone-900/40 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-xl text-xs leading-relaxed text-stone-400 dark:text-stone-500">
            Some buy links here are affiliate links, clicking through and
            purchasing may earn me a small commission at no extra cost to you.
            Reviews and ratings are based entirely on my own use; nothing on
            this site is paid placement.
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
