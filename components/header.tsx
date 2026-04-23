import Link from "next/link";
import { Container } from "./container";
import { site } from "@/lib/site";

const nav = [
  { href: "/skincare", label: "Skincare" },
  { href: "/supplements", label: "Supplements" },
  { href: "/oral-care", label: "Oral care" },
  { href: "/photos", label: "Photos" },
  { href: "/notes", label: "Notes" },
  { href: "/now", label: "Now" },
  { href: "/about", label: "About" },
  { href: "/links", label: "Links" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="group inline-flex items-baseline gap-1.5 text-stone-900"
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
        <nav className="flex items-center overflow-x-auto text-[11px] uppercase tracking-[0.16em] text-stone-500">
          {nav.map((item, i) => (
            <span key={item.href} className="inline-flex items-center">
              {i > 0 && (
                <span aria-hidden className="mx-3 text-stone-300">
                  ·
                </span>
              )}
              <Link
                href={item.href}
                className="whitespace-nowrap py-1 transition-colors hover:text-stone-900"
              >
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
      </Container>
    </header>
  );
}
