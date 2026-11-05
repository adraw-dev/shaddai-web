import type { ReactNode } from "react";
import type { RichTextBlock, RichTextInline } from "@/domain/catalog";

/**
 * Renderiza el texto enriquecido del dominio (ST-06) sin HTML arbitrario ni dependencias.
 * Los saltos de línea dentro de un bloque se respetan con `whitespace-pre-line`.
 */
function Inline({ nodes }: { nodes: RichTextInline[] }) {
  return nodes.map((node, i) => {
    let content: ReactNode = node.text;
    if (node.italic) content = <em>{content}</em>;
    if (node.bold) content = <strong className="font-semibold">{content}</strong>;
    return <span key={i}>{content}</span>;
  });
}

export function RichText({ blocks }: { blocks: RichTextBlock[] }) {
  return (
    <div className="max-w-prose space-y-4 leading-relaxed whitespace-pre-line">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading": {
            const Tag = `h${block.level}` as const;
            return (
              <Tag key={i} className="pt-2 font-display text-lg font-semibold text-pretty">
                <Inline nodes={block.children} />
              </Tag>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="border-l-4 border-copper/40 pl-4">
                <Inline nodes={block.children} />
              </blockquote>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List key={i} className={`space-y-1 pl-5 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-copper`}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <Inline nodes={item} />
                  </li>
                ))}
              </List>
            );
          }
          default:
            return (
              <p key={i}>
                <Inline nodes={block.children} />
              </p>
            );
        }
      })}
    </div>
  );
}
