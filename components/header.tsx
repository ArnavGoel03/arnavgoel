import Link from "next/link";
import { Container } from "./container";
import { site } from "@/lib/site";

const nav = [
  { href: "/about", label: "About" },
  { href: "/now", label: "Now" },
  { href: "/notes", label: "Notes" },
  { href: "/photos", label: "Photos" },
  { href: "/skincare", label: "Skincare" },
  { href: "/supplements", label: "Supplements" },
  { href: "/oral-care", label: "Oral care" },
  { href: "/links", label: "Links" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-stone-900"
        >
          {site.shortName}
        </Link>
        <nav className="flex items-center gap-5 overflow-x-auto text-sm text-stone-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap transition-colors hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
