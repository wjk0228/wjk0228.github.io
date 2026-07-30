import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const GET: APIRoute = ({ site: configuredSite }) => {
  const baseURL = configuredSite ?? new URL(site.domain);
  const sitemapURL = new URL('/sitemap-index.xml', baseURL);
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${sitemapURL.href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
