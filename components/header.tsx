"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "./theme-toggle";
import { site } from "@/lib/site";

type NavItem = {
  href: string;
  label: string;
  tourId?: string;
  /**
   * Nav weight controls which breakpoints reveal the link.
   *   "primary"   — visible at lg+ (the five product categories,
   *                 always present in the masthead).
   *   "secondary" — joins primary at xl+; collapses into the mobile
   *                 drawer below xl so the lg row stays uncluttered.
   */
  weight: "primary" | "secondary";
};

const nav: NavItem[] = [
  { href: "/skincare", label: "Skincare", tourId: "tab-skincare", weight: "primary" },
  { href: "/supplements", label: "Supplements", tourId: "tab-supplements", weight: "primary" },
  { href: "/oral-care", label: "Oral care", tourId: "tab-oralcare", weight: "primary" },
  { href: "/hair-care", label: "Hair care", tourId: "tab-haircare", weight: "primary" },
  { href: "/body-care", label: "Body care", tourId: "tab-bodycare", weight: "primary" },
  { href: "/essentials", label: "Essentials", tourId: "tab-essentials", weight: "primary" },
  { href: "/routine", label: "Routine", weight: "secondary" },
  { href: "/primers", label: "Primers", weight: "secondary" },
  { href: "/photos", label: "Photos", weight: "secondary" },
  { href: "/notes", label: "Notes", weight: "secondary" },
  { href: "/now", label: "Now", weight: "secondary" },
  { href: "/about", label: "About", weight: "secondary" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu on route change so it doesn't linger open
  // after a nav tap.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

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

        <div className="flex items-center gap-2 lg:gap-4">
          {/* Desktop nav. Primary (5 product categories) shows at lg+;
              secondary (Routine / Primers / Photos / Notes / Now /
              About) joins at xl+. Below lg the hamburger menu carries
              everything. */}
          <nav className="hidden items-center text-[11px] uppercase tracking-[0.16em] text-stone-500 lg:flex dark:text-stone-400">
            {nav.map((item, i) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const isSecondary = item.weight === "secondary";
              return (
                <span
                  key={item.href}
                  className={
                    isSecondary
                      ? "hidden xl:inline-flex items-center"
                      : "inline-flex items-center"
                  }
                >
                  {i > 0 && (
                    <span
                      aria-hidden
                      className={
                        "text-stone-300 dark:text-stone-700 " +
                        (isSecondary ? "mx-3 hidden xl:inline" : "mx-3")
                      }
                    >
                      ·
                    </span>
                  )}
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    data-tour={item.tourId}
                    className={
                      "relative whitespace-nowrap py-1 transition-colors " +
                      (active
                        ? "text-stone-900 dark:text-stone-100 after:absolute after:-bottom-px after:left-0 after:right-0 after:h-px after:bg-rose-400"
                        : "hover:text-stone-900 dark:hover:text-stone-100")
                    }
                  >
                    {item.label}
                  </Link>
                </span>
              );
            })}
            {/* "More" link visible only at lg (hidden at xl when the
                secondary items appear inline). Routes to /about as a
                catch-all landing for the smaller meta sections. */}
            <span className="ml-3 inline-flex items-center xl:hidden">
              <span aria-hidden className="mr-3 text-stone-300 dark:text-stone-700">·</span>
              <Link
                href="/about"
                className="whitespace-nowrap py-1 text-stone-400 transition-colors hover:text-stone-900 dark:text-stone-500 dark:hover:text-stone-100"
              >
                More →
              </Link>
            </span>
          </nav>

          <button
            type="button"
            aria-label="Open search"
            data-tour="search"
            onClick={() => {
              window.dispatchEvent(new Event("palette:open"));
            }}
            className="group hidden h-8 shrink-0 items-center gap-2 rounded-full border border-stone-200 bg-white pl-3 pr-1.5 text-[11px] uppercase tracking-[0.16em] text-stone-500 transition-colors hover:border-stone-300 hover:text-stone-900 sm:inline-flex dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:text-stone-100"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 font-mono text-[10px] tracking-normal text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            aria-label="Open search"
            onClick={() => {
              window.dispatchEvent(new Event("palette:open"));
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 sm:hidden dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
          >
            <Search className="h-4 w-4" />
          </button>
          <div data-tour="theme">
            <ThemeToggle />
          </div>

          {/* Mobile menu trigger, hides at lg */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100 lg:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="fixed inset-x-0 top-16 z-40 origin-top animate-[menu-slide_180ms_cubic-bezier(0.22,1,0.36,1)] border-b border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950 lg:hidden"
          style={{ maxHeight: "calc(100dvh - 4rem)", overflowY: "auto" }}
        >
          <Container>
            <nav aria-label="Site navigation" className="py-4">
              <ol className="divide-y divide-stone-100 dark:divide-stone-800">
                {nav.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="flex items-baseline justify-between gap-4 py-4"
                      >
                        <span
                          className={
                            "font-serif text-xl " +
                            (active
                              ? "text-rose-700 dark:text-rose-400"
                              : "text-stone-900 dark:text-stone-100")
                          }
                        >
                          {item.label}
                        </span>
                        <span
                          aria-hidden
                          className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500"
                        >
                          {item.href}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
