/** Une clases condicionales. Sustituye a clsx/tailwind-merge (plan §7.3). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
