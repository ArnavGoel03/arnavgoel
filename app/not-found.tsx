import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-32 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">404</p>
      <h1 className="mt-4 font-serif text-5xl text-stone-900">
        Nothing here.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-stone-600">
        That review doesn&apos;t exist. It might have been renamed, or maybe I
        never wrote it.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-stone-900 px-5 py-3 text-sm text-white transition-colors hover:bg-stone-800"
      >
        Back home
      </Link>
    </Container>
  );
}
