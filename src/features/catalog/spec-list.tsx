import type { ProductSpec } from "@/domain/catalog";

/** Ficha técnica como lista de definiciones (rótulo → valor). */
export function SpecList({ specs }: { specs: ProductSpec[] }) {
  return (
    <dl className="divide-y divide-espresso-900/10 rounded-card bg-white px-5 ring-1 ring-espresso-900/8">
      {specs.map((spec) => (
        <div key={spec.label} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-6">
          <dt className="text-sm font-semibold text-muted">{spec.label}</dt>
          <dd className="text-ink">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
