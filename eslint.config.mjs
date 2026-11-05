import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Sitio estático sin `next/image` (docs/PLAN_DESARROLLO.md §7.2): las imágenes se sirven con
    // <img srcset width height> a través de components/media/picture.tsx.
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Strapi (CMS) es un proyecto Node aparte con su propia configuración (docs/PLAN_STRAPI.md).
    "cms/**",
  ]),
]);

export default eslintConfig;
