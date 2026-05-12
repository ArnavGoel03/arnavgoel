"use client";

import { useMemo, useState, useTransition } from "react";
import type { Photo } from "@/lib/types";
import { updatePhotosManifest } from "../actions";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "saving" } | { kind: "ok"; message: string } | { kind: "error"; message: string };

export function PhotoManager({ initial }: { initial: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initial);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [pending, startTransition] = useTransition();

  const dirty = useMemo(
    () => JSON.stringify(photos) !== JSON.stringify(initial),
    [photos, initial],
  );

  function toggleSelected(src: string, additive: boolean) {
    setSelected((prev) => {
      const next = new Set(additive ? prev : []);
      if (prev.has(src)) {
        next.delete(src);
      } else {
        next.add(src);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function selectAll() {
    setSelected(new Set(photos.map((p) => p.src)));
  }

  function setHiddenForSelected(hidden: boolean) {
    if (selected.size === 0) return;
    setPhotos((prev) =>
      prev.map((p) => (selected.has(p.src) ? { ...p, hidden } : p)),
    );
  }

  function removeSelected() {
    if (selected.size === 0) return;
    const count = selected.size;
    if (
      !confirm(
        `Remove ${count} ${count === 1 ? "entry" : "entries"} from the manifest? The Blob asset stays uploaded, only the JSON pointer is removed. Re-add via /admin Add photo if needed.`,
      )
    ) {
      return;
    }
    setPhotos((prev) => prev.filter((p) => !selected.has(p.src)));
    clearSelection();
  }

  function onDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== dragOverIndex) setDragOverIndex(index);
  }

  function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const from = dragIndex;
    setDragIndex(null);
    setDragOverIndex(null);
    if (from === null || from === dropIndex) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(dropIndex, 0, moved);
      return next;
    });
  }

  function onDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function save() {
    setStatus({ kind: "saving" });
    const payload = JSON.stringify(photos);
    startTransition(async () => {
      const res = await updatePhotosManifest(payload);
      if (res.ok) {
        setStatus({ kind: "ok", message: res.message ?? "Saved." });
      } else {
        setStatus({ kind: "error", message: res.error ?? "Save failed." });
      }
    });
  }

  function discard() {
    setPhotos(initial);
    clearSelection();
    setStatus({ kind: "idle" });
  }

  const visibleCount = photos.filter((p) => !p.hidden).length;
  const hiddenCount = photos.length - visibleCount;

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mx-6 flex flex-wrap items-center gap-3 border-b border-stone-200 bg-white/85 px-6 py-3 backdrop-blur">
        <span className="text-xs text-stone-500">
          {visibleCount} visible · {hiddenCount} hidden · {selected.size} selected
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={selected.size === photos.length ? clearSelection : selectAll}
          className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
        >
          {selected.size === photos.length ? "Deselect all" : "Select all"}
        </button>
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() => setHiddenForSelected(true)}
          className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 disabled:opacity-40"
        >
          Hide selected
        </button>
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() => setHiddenForSelected(false)}
          className="rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 disabled:opacity-40"
        >
          Show selected
        </button>
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={removeSelected}
          className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-40"
        >
          Remove from manifest
        </button>
        <div className="mx-2 h-5 w-px bg-stone-200" />
        <button
          type="button"
          disabled={!dirty || pending}
          onClick={discard}
          className="rounded-full px-3 py-1.5 text-xs text-stone-500 hover:text-stone-900 disabled:opacity-40"
        >
          Discard
        </button>
        <button
          type="button"
          disabled={!dirty || pending}
          onClick={save}
          className="rounded-full bg-stone-900 px-4 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-40"
        >
          {pending ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </button>
      </div>

      {status.kind === "ok" && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {status.message}
        </p>
      )}
      {status.kind === "error" && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.message}
        </p>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo, index) => {
          const isSelected = selected.has(photo.src);
          const isDragging = dragIndex === index;
          const isDragOver = dragOverIndex === index && dragIndex !== null && dragIndex !== index;
          return (
            <li
              key={photo.src}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={(e) => onDrop(e, index)}
              onDragEnd={onDragEnd}
              onClick={(e) => toggleSelected(photo.src, e.shiftKey || e.metaKey || e.ctrlKey)}
              className={cn(
                "group relative cursor-pointer overflow-hidden rounded-xl border bg-stone-50 transition-all",
                isSelected
                  ? "border-stone-900 ring-2 ring-stone-900 ring-offset-2"
                  : "border-stone-200 hover:border-stone-400",
                photo.hidden && "opacity-50",
                isDragging && "opacity-30",
                isDragOver && "ring-2 ring-rose-500 ring-offset-2",
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-2 top-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded border-2 bg-white/95 text-stone-900",
                      isSelected ? "border-stone-900" : "border-stone-300",
                    )}
                  >
                    {isSelected && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className="rounded bg-white/85 px-1.5 py-0.5 font-mono text-[10px] text-stone-700 backdrop-blur">
                    #{index + 1}
                  </span>
                </div>
                {photo.hidden && (
                  <span className="absolute right-2 top-2 rounded bg-stone-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white">
                    Hidden
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotos((prev) =>
                      prev.map((p) =>
                        p.src === photo.src ? { ...p, hidden: !p.hidden } : p,
                      ),
                    );
                  }}
                  className="absolute bottom-2 right-2 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-stone-800 opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                >
                  {photo.hidden ? "Show" : "Hide"}
                </button>
              </div>
              <div className="space-y-1 px-2.5 py-2 text-xs">
                <p className="line-clamp-1 font-medium text-stone-900">{photo.caption || photo.alt}</p>
                <p className="line-clamp-1 text-stone-500">
                  {photo.date}
                  {photo.location ? ` · ${photo.location}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ul>

      {photos.length === 0 && (
        <p className="rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 px-6 py-12 text-center text-sm text-stone-500">
          No photos in the manifest yet. Upload one from{" "}
          <a href="/admin" className="underline">Add photo</a> in the main admin panel.
        </p>
      )}
    </div>
  );
}
