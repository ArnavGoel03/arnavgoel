import { getAllPhotos } from "@/lib/photos";
import { PhotoManager } from "./photo-manager";

export const metadata = {
  title: "Manage photos",
  robots: { index: false, follow: false },
};

export default function AdminPhotosPage() {
  const photos = getAllPhotos();
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Manage photos</h1>
          <p className="mt-1 text-sm text-stone-500">
            {photos.length} entries in <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">content/photos.json</code>.
            Drag tiles to reorder, toggle visibility, or select multiple for bulk
            actions. Hidden photos stay in Blob and can be unhidden any time.
          </p>
        </div>
        <a
          href="/admin"
          className="text-sm text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline"
        >
          ← Back to admin
        </a>
      </header>
      <PhotoManager initial={photos} />
    </main>
  );
}
