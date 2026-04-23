"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadProductImage } from "./actions";
import { cn } from "@/lib/utils";

export function ProductPhotoUpload({
  initialUrl,
  fieldName,
}: {
  initialUrl?: string;
  fieldName: string;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onPick(file: File | null) {
    if (!file) return;
    setError(null);
    setPending(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProductImage(fd);
      if (result.ok && result.url) {
        setUrl(result.url);
      } else {
        setError(result.error ?? "Upload failed.");
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={fieldName} value={url} />

      <div
        onClick={() => !pending && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!pending) onPick(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-6 text-center transition-colors",
          !pending && "hover:border-stone-300 hover:bg-stone-100",
          pending && "opacity-60",
        )}
      >
        {url ? (
          <div className="flex flex-col items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Product photo"
              className="max-h-48 rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUrl("");
              }}
              className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 hover:border-stone-300 hover:text-stone-900"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 py-3">
            <Upload className="h-5 w-5 text-stone-400" />
            <p className="text-sm text-stone-700">
              {pending ? "Uploading…" : "Drop an image, or click to choose"}
            </p>
            <p className="text-xs text-stone-500">
              Stored at original quality on Vercel Blob.
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />

      {error && (
        <p className="text-xs text-red-700">{error}</p>
      )}

      <details className="text-xs text-stone-500">
        <summary className="cursor-pointer hover:text-stone-700">
          Or paste an image URL instead
        </summary>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="mt-2 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-400"
        />
      </details>
    </div>
  );
}
