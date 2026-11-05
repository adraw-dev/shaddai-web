import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Ancho máximo ~1200 px con gutter de 16 px (móvil) → 24 → 32 px (plan §5.7). */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[75rem] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
