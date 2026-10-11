import type { APIContext } from 'astro';
import { getPosts, isoDate, TAGS } from '../lib';

// Every public page, regenerated on each build so new posts appear automatically.
export async function GET({ site }: APIContext) {
  const posts = await getPosts();
  const pages: [string, Date?][] = [
    ['/'], ['/notes'], ['/try'], ['/about'],
    ...TAGS.map((t): [string] => [`/tags/${t}`]),
    ...posts.map((p): [string, Date] => [`/posts/${p.id}`, p.data.tended ?? p.data.planted]),
  ];
  const urls = pages.map(([path, date]) =>
    `  <url><loc>${new URL(path, site)}</loc>${date ? `<lastmod>${isoDate(date)}</lastmod>` : ''}</url>`);
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
}
