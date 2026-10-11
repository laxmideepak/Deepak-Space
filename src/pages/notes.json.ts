import inference from '../data/inference.json';
import { getPosts, pageText, plainText, tokenize } from '../lib';

// Everything on the site as GPT-4o tokens, for the regex-window search on /notes.
// Fetched only when someone focuses the search box.

// Static pages: their visible text, pulled from the source at build time.
const sources = import.meta.glob<string>('./{about,try,notes}.astro', { query: '?raw', import: 'default', eager: true });
const TITLES: Record<string, string> = { about: 'About', try: 'Try it', notes: 'Notes' };

export async function GET() {
  const home = { url: '/', title: 'Home', pieces: tokenize(['Deepak Nelapatla', inference.system, ...inference.lines].join('\n')) };
  const pages = Object.entries(sources).map(([file, src]) => {
    const name = file.replace(/^\.\/|\.astro$/g, '');
    return { url: `/${name}`, title: TITLES[name], pieces: tokenize(pageText(src)) };
  });
  const posts = (await getPosts()).map((p) => ({ url: `/posts/${p.id}`, title: p.data.title, pieces: tokenize(plainText(p.body)) }));
  return new Response(JSON.stringify([...posts, home, ...pages]), { headers: { 'Content-Type': 'application/json' } });
}
