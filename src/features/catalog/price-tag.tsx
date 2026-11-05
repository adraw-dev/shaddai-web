import type { Price } from "@/domain/catalog";
import { cn } from "@/lib/cn";
import { catalogContent } from "./catalog-content";
import { formatCop } from "./format";

type PriceTagProps = {
  price?: Price;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const amountSizes = { sm: "text-base", md: "text-lg", lg: "text-h3" } as const;

/**
 * Precio vigente (ST-03: visibles). Con oferta, el precio anterior va tachado y se anuncia como
 * «Antes» a lectores de pantalla. Sin precio o con `visible: false` → «Precio a cotizar».
 */
export function PriceTag({ price, size = "md", className }: PriceTagProps) {
  if (!price?.visible) {
    return (
      <p className={cn("font-semibold [color:var(--muted)]", size === "sm" && "text-sm", className)}>
        {catalogContent.quoteNoPrice}
      </p>
    );
  }

  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-display font-bold tabular-nums", amountSizes[size])}>{formatCop(price.amount)}</span>
      {price.compareAtAmount ? (
        <s className={cn("tabular-nums [color:var(--muted)]", size === "sm" ? "text-xs" : "text-sm")}>
          <span className="sr-only">{catalogContent.previousPrice}: </span>
          {formatCop(price.compareAtAmount)}
        </s>
      ) : null}
    </p>
  );
}
