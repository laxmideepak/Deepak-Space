// Vercel Routing Middleware: runs before static files are served, so agents that ask for
// Markdown (Accept: text/markdown) get the /md/*.md version of a page. Browsers keep the HTML.
export const config = { matcher: ['/((?!md/|_astro/|fonts/|.*\\.).*)'] };

export default function middleware(request: Request) {
  if (!request.headers.get('accept')?.includes('text/markdown')) return;
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/index' : url.pathname.replace(/\/$/, '');
  // ponytail: the raw rewrite header that @vercel/functions' rewrite() sets, without adding the dependency
  return new Response(null, { headers: { 'x-middleware-rewrite': new URL(`/md${path}.md`, url).href } });
}
