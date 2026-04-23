import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PhotoTile } from "@/components/photo-tile";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photos",
  description: `DSLR photography by ${site.name}.`,
  alternates: { canonical: "/photos" },
};

export default function PhotosPage() {
  return (
    <>
      <Container>
        <div className="mx-auto max-w-2xl py-16 text-center sm:py-20">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-stone-500">
            Photos
          </p>
          <h1 className="font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
            Shot on DSLR.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-stone-600">
            A small, slowly-growing gallery. Shot when I remembered to bring
            the camera and felt like pointing it at something.
          </p>
        </div>
      </Container>
      <Container className="pb-20">
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map((p) => (
            <PhotoTile key={p.src} photo={p} />
          ))}
        </div>
      </Container>
    </>
  );
}
