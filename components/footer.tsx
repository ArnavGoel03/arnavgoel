import { ArrowUpRight } from "lucide-react";
import { Container } from "./container";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200/70 py-12 text-sm text-stone-500">
      <Container className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-base text-stone-700">
            © {new Date().getFullYear()} {site.name}
          </p>
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
        <p className="text-xs leading-relaxed text-stone-400">
          Some buy links here are affiliate links — clicking through and
          purchasing may earn me a small commission at no extra cost to you.
          Reviews and ratings are based entirely on my own use; nothing on this
          site is paid placement.
        </p>
      </Container>
    </footer>
  );
}
