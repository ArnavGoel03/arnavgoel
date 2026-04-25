import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { listTrashed, TRASH_GRACE_DAYS } from "@/lib/trash";
import { TrashTable } from "./trash-table";

export const metadata: Metadata = {
  title: "Trash",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function TrashPage() {
  let entries: Awaited<ReturnType<typeof listTrashed>> = [];
  let loadError: string | null = null;
  try {
    entries = await listTrashed();
  } catch (err) {
    loadError = (err as Error).message;
  }

  return (
    <Container className="max-w-4xl py-12">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Admin
      </Link>

      <div className="mt-8 border-b border-stone-300 pb-8 dark:border-stone-800">
        <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
          <span className="text-rose-400">❋</span> Storage
        </p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight text-stone-900 dark:text-stone-100 sm:text-5xl">
          Trash
          <span className="text-rose-400">.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-base italic leading-snug text-stone-600 dark:text-stone-300">
          Photos that were removed from a product card. They sit here for{" "}
          <strong>{TRASH_GRACE_DAYS} days</strong> before a daily cron
          permanently deletes them. Restore one to put it straight back into
          rotation.
        </p>
      </div>

      {loadError && (
        <p className="mt-8 rounded-xl border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-200">
          Failed to list trashed assets: {loadError}
        </p>
      )}

      {!loadError && entries.length === 0 && (
        <p className="mt-12 py-12 text-center font-serif italic text-stone-500 dark:text-stone-400">
          Nothing in trash.
        </p>
      )}

      {entries.length > 0 && <TrashTable entries={entries} />}
    </Container>
  );
}
