import Link from "next/link";
import { Container } from "./container";
import { site } from "@/lib/site";

const nav = [
  { href: "/skincare", label: "Skincare" },
  { href: "/supplements", label: "Supplements" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-stone-900"
        >
          {site.name}
        </Link>
        <nav className="flex items-center gap-6 text-sm text-stone-600">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
