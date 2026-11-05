import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  // URL pública. En Render se toma de RENDER_EXTERNAL_URL (la define Render); vacía en local.
  url: env('PUBLIC_URL', env('RENDER_EXTERNAL_URL', '')),
  // Detrás del proxy HTTPS de Render: confiar en X-Forwarded-* (cookies seguras del panel).
  proxy: { koa: env.bool('IS_PROXIED', false) },
  // Carpeta pública (contiene uploads/). En Render vive DENTRO del disco persistente
  // (PUBLIC_DIR=/var/data/public): si el disco se montara directamente en uploads/,
  // `strapi transfer` fallaría al intentar mover ese punto de montaje para su copia de seguridad.
  dirs: { public: env('PUBLIC_DIR', './public') },
  app: {
    keys: env.array('APP_KEYS')!,
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
