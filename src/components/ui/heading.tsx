import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Level = 1 | 2 | 3;
type Size = "display" | "h1" | "h2" | "h3";

/** Clases estáticas (Tailwind no detecta nombres armados dinámicamente). */
const sizes: Record<Size, string> = {
  display: "text-display font-extrabold tracking-[-0.025em]",
  h1: "text-h1 font-bold tracking-[-0.02em]",
  h2: "text-h2 font-bold tracking-[-0.02em]",
  h3: "text-h3 font-semibold tracking-[-0.01em]",
};

const defaultSize: Record<Level, Size> = { 1: "h1", 2: "h2", 3: "h3" };

type HeadingProps = {
  /** Nivel semántico (un solo h1 por página). */
  level?: Level;
  /** Tamaño visual, independiente del nivel. */
  size?: Size;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function Heading({ level = 2, size, id, className, children }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag id={id} className={cn("font-display", sizes[size ?? defaultSize[level]], className)}>
      {children}
    </Tag>
  );
}
