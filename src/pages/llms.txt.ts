import type { APIContext } from 'astro';
import { getPosts } from '../lib';

// A plain-text index of the site for language models (https://llmstxt.org).
export async function GET({ site }: APIContext) {
  const rows = (await getPosts()).map(
    (p) => `- [${p.data.title}](${new URL(`/posts/${p.id}`, site)})${p.data.description ? `: ${p.data.description}` : ''}`,
  );
  const body = `# Deepak’s Tokenizer

> Notes by Deepak Nelapatla, ML engineer on the ML4H team at the Broad Institute (LLMs on clinical EHR notes). Learnings from work, thoughts on life, and the games he plays.

## Notes

${rows.join('\n')}

## About

- [About](${new URL('/about', site)})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
