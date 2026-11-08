export function GET() {
  const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const siteUrl =
    import.meta.env.PUBLIC_SITE_URL || 'https://studio.archexweb.in';
  const lines = [
    'User-agent: *',
    allowIndexing ? 'Allow: /' : 'Disallow: /',
    allowIndexing ? `Sitemap: ${siteUrl}/sitemap.xml` : '',
  ].filter(Boolean);
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
