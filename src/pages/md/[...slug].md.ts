import type { APIContext } from 'astro';
import inference from '../../data/inference.json';
import { getPosts, pageText, TAGS, type Post } from '../../lib';

// Markdown versions of every page. middleware.ts serves them in place of the HTML when a
// request sends `Accept: text/markdown` (agents); browsers keep getting HTML.
const sources = import.meta.glob<string>('../{about,try,notes}.astro', { query: '?raw', import: 'default', eager: true });

const link = (p: Post) => `- [${p.data.title}](/posts/${p.id})${p.data.description ? `: ${p.data.description}` : ''}`;
// Figures are HTML; agents get their caption instead.
const prose = (body = '') =>
  body.replace(/<figure[\s\S]*?<figcaption[^>]*>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g, '*Figure: $1*').trim();

export async function getStaticPaths() {
  const posts = await getPosts();
  const home = [
    '# Deepak Nelapatla',
    `> ${inference.system}`,
    inference.lines.join('\n'),
    '## Notes',
    posts.map(link).join('\n'),
  ].join('\n\n');
  const pages = Object.entries(sources).map(([file, src]) => ({
    params: { slug: file.replace(/^\.\.\/|\.astro$/g, '') },
    props: { md: pageText(src) },
  }));
  const tags = TAGS.map((tag) => {
    const tagged = posts.filter((p) => p.data.tags.includes(tag));
    return { params: { slug: `tags/${tag}` }, props: { md: `# ${tag[0].toUpperCase() + tag.slice(1)}\n\n${tagged.map(link).join('\n') || 'No notes yet.'}` } };
  });
  const notes = posts.map((p) => ({
    params: { slug: `posts/${p.id}` },
    props: { md: [`# ${p.data.title}`, p.data.description ?? '', `${p.data.stage} · planted ${p.data.planted.toISOString().slice(0, 10)}`, prose(p.body)].filter(Boolean).join('\n\n') },
  }));
  return [{ params: { slug: 'index' }, props: { md: home } }, ...pages, ...tags, ...notes];
}

export function GET({ props }: APIContext) {
  return new Response(`${props.md}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
