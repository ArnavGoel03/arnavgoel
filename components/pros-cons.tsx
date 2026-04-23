import { Check, X } from "lucide-react";

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h3 className="mb-3 font-serif text-lg text-emerald-900">What works</h3>
        <ul className="space-y-2">
          {pros.map((p) => (
            <li key={p} className="flex gap-2 text-sm text-stone-700">
              <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
        <h3 className="mb-3 font-serif text-lg text-rose-900">What doesn&apos;t</h3>
        <ul className="space-y-2">
          {cons.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-stone-700">
              <X className="mt-0.5 h-4 w-4 flex-none text-rose-600" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
