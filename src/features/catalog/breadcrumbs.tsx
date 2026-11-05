import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Migas de pan. El último elemento es la página actual (sin enlace, aria-current). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 [color:var(--muted)]">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="inline-flex min-h-11 items-center font-semibold text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
