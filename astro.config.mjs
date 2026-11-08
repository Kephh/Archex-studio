import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: import.meta.env.PUBLIC_SITE_URL || 'https://studio.archexweb.in',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
