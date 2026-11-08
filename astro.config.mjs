import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site:
    import.meta.env.PUBLIC_SITE_URL ||
    (import.meta.env.VERCEL_URL
      ? `https://${import.meta.env.VERCEL_URL}`
      : 'https://studio.archexweb.in'),
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
