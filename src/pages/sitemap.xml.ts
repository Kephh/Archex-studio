export function GET() {
  const allowIndexing =
    import.meta.env.VERCEL_ENV === 'production' &&
    import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const siteUrl =
    import.meta.env.PUBLIC_SITE_URL ||
    (import.meta.env.VERCEL_URL
      ? `https://${import.meta.env.VERCEL_URL}`
      : 'https://studio.archexweb.in');
  const pages = ['/', '/work/', '/capabilities/', '/studio/', '/contact/'];
  const body = allowIndexing
    ? `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map((page) => `<url><loc>${new URL(page, siteUrl)}</loc></url>`).join('')}</urlset>`
    : `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
