import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/lib/site";

const nav = [
  { href: "/skincare", label: "Skincare" },
  { href: "/supplements", label: "Supplements" },
  { href: "/oral-care", label: "Oral care" },
  { href: "/routine", label: "Routine" },
  { href: "/primers", label: "Primers" },
  { href: "/photos", label: "Photos" },
  { href: "/notes", label: "Notes" },
  { href: "/now", label: "Now" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur dark:border-stone-900/40 dark:bg-stone-950/80">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="group inline-flex items-baseline gap-1.5 text-stone-900 dark:text-stone-100"
        >
          <span className="font-serif text-2xl italic leading-none tracking-tight">
            {site.shortName}
          </span>
          <span
            aria-hidden
            className="text-rose-400 transition-transform duration-300 group-hover:rotate-90"
          >
            ❋
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <nav
            data-tour="nav"
            className="flex items-center overflow-x-auto text-[11px] uppercase tracking-[0.16em] text-stone-500 dark:text-stone-400"
          >
            {nav.map((item, i) => (
              <span key={item.href} className="inline-flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="mx-3 text-stone-300 dark:text-stone-700"
                  >
                    ·
                  </span>
                )}
                <Link
                  href={item.href}
                  className="whitespace-nowrap py-1 transition-colors hover:text-stone-900 dark:hover:text-stone-100"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
          <Link
            href="/search"
            aria-label="Search"
            data-tour="search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <Search className="h-4 w-4" />
          </Link>
          <div data-tour="theme">
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
