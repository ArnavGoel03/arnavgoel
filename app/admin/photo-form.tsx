"use client";

import { useActionState, useRef, useState } from "react";
import { createPhoto, type ActionState } from "./actions";
import { cn } from "@/lib/utils";

const today = () => new Date().toISOString().slice(0, 10);

const labelCls = "block text-xs uppercase tracking-wider text-stone-500 mb-1.5";
const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-stone-400";

type Dimensions = { width: number; height: number };

export function PhotoForm() {
  const [state, action, pending] = useActionState<ActionState | null, FormData>(
    createPhoto,
    null,
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions | null>(null);
  const [probeError, setProbeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onPick(selected: File | null) {
    setFile(selected);
    setPreview(null);
    setDimensions(null);
    setProbeError(null);
    if (!selected) return;

    if (selected.type.startsWith("image/")) {
      const url = URL.createObjectURL(selected);
      setPreview(url);
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        setProbeError(
          "Could not read dimensions from this file. It'll still upload at original quality, but you may need to enter width/height manually below.",
        );
      };
      img.src = url;
    } else {
      setProbeError(
        "Non-image file selected. It'll upload as-is but won't display on the photos page without manual editing.",
      );
    }
  }

  return (
    <form action={action} className="space-y-8">
      <div>
        <span className={labelCls}>Original file</span>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0] ?? null;
            onPick(f);
          }}
          className="cursor-pointer rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 p-8 text-center transition-colors hover:border-stone-300 hover:bg-stone-100"
        >
          {preview ? (
            <div className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="max-h-64 rounded-lg object-contain"
              />
              <p className="text-xs text-stone-500">
                {file?.name} · {(file!.size / 1024 / 1024).toFixed(2)} MB
                {dimensions && ` · ${dimensions.width}×${dimensions.height}`}
              </p>
              <p className="text-xs text-stone-400">Click or drop to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 py-6">
              <p className="text-sm text-stone-700">
                Click to pick a file, or drop it here
              </p>
              <p className="text-xs text-stone-500">
                Uploaded at original quality — no recompression, no resizing.
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
          required
        />
        {probeError && (
          <p className="mt-2 text-xs text-amber-700">{probeError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="width" className={labelCls}>Width (px)</label>
          <input
            id="width"
            name="width"
            type="number"
            min="1"
            value={dimensions?.width ?? ""}
            onChange={(e) =>
              setDimensions((d) => ({
                width: Number(e.target.value) || 0,
                height: d?.height ?? 0,
              }))
            }
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="height" className={labelCls}>Height (px)</label>
          <input
            id="height"
            name="height"
            type="number"
            min="1"
            value={dimensions?.height ?? ""}
            onChange={(e) =>
              setDimensions((d) => ({
                width: d?.width ?? 0,
                height: Number(e.target.value) || 0,
              }))
            }
            required
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="alt" className={labelCls}>Alt text</label>
        <input
          id="alt"
          name="alt"
          placeholder="Sunset over the harbor"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="caption" className={labelCls}>Caption</label>
        <input
          id="caption"
          name="caption"
          placeholder="One sentence describing the shot."
          required
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="location" className={labelCls}>Location (optional)</label>
          <input
            id="location"
            name="location"
            placeholder="Lisbon, Portugal"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="date" className={labelCls}>Date taken</label>
          <input
            id="date"
            name="date"
            type="date"
            defaultValue={today()}
            required
            className={cn(inputCls)}
          />
        </div>
      </div>

      {state?.ok === false && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state?.ok && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={pending || !file}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-stone-900 px-6 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:opacity-50"
      >
        {pending ? "Uploading…" : "Upload photo"}
      </button>
    </form>
  );
}
