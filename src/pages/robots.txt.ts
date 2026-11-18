export function GET() {
  const isExplicitlyDisallowed =
    import.meta.env.PUBLIC_ALLOW_INDEXING === 'false';
  const siteUrl =
    import.meta.env.PUBLIC_SITE_URL ||
    (import.meta.env.VERCEL_URL
      ? `https://${import.meta.env.VERCEL_URL}`
      : 'https://studio.archexweb.in');
  const lines = isExplicitlyDisallowed
    ? [
        'User-agent: *',
        'Disallow: /',
        `Sitemap: ${siteUrl}/sitemap.xml`,
      ]
    : [
        'User-agent: *',
        'Allow: /',
        'Disallow: /archex-craft/',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
      ];
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
