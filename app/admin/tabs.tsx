"use client";

import { useState } from "react";
import { ProductForm } from "./product-form";
import { PhotoForm } from "./photo-form";
import { cn } from "@/lib/utils";

type Tab = "product" | "photo" | "edit";

export function AdminTabs({ editList }: { editList: React.ReactNode }) {
  const [tab, setTab] = useState<Tab>("product");

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex gap-2 border-b border-stone-200 pb-px">
        {(
          [
            { id: "product", label: "Add product" },
            { id: "photo", label: "Add photo" },
            { id: "edit", label: "Edit existing" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative px-4 py-2 text-sm transition-colors",
              tab === t.id
                ? "text-stone-900"
                : "text-stone-500 hover:text-stone-900",
            )}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-stone-900" />
            )}
          </button>
        ))}
      </div>

      {tab === "product" && <ProductForm />}
      {tab === "photo" && <PhotoForm />}
      {tab === "edit" && editList}
    </div>
  );
}
