import { Container } from "./container";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-stone-200/70 py-10 text-sm text-stone-500">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="text-stone-400">Built quietly, shipped slowly.</p>
      </Container>
    </footer>
  );
}
