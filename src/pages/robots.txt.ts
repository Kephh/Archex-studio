export function GET() {
  const siteUrl =
    import.meta.env.PUBLIC_SITE_URL ||
    (import.meta.env.VERCEL_URL
      ? `https://${import.meta.env.VERCEL_URL}`
      : 'https://studio.archexweb.in');
  const lines = [
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
