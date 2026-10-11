import { getCollection, type CollectionEntry } from 'astro:content';
import { Tiktoken } from 'js-tiktoken/lite';
import o200k_base from 'js-tiktoken/ranks/o200k_base';

export type Post = CollectionEntry<'posts'>;

export const TAGS = ['learnings', 'thoughts', 'play'] as const;

const lastTouched = (p: Post) => (p.data.tended ?? p.data.planted).getTime();

export async function getPosts() {
  return (await getCollection('posts')).sort((a, b) => lastTouched(b) - lastTouched(a));
}

export const fmt = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

// Machine-readable date for <time datetime>, in UTC to match fmt.
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

// Same tokenizer as GPT-4o. Runs at build time only, nothing ships to the browser.
const enc = new Tiktoken(o200k_base);

export const tokenize = (text: string) => enc.encode(text).map((t) => enc.decode([t]));

// The words people read: no figures, HTML or Markdown syntax.
export function plainText(markdown = '') {
  return markdown
    .replace(/<figure[\s\S]*?<\/figure>/g, '')
    .replace(/^```.*$/gm, '') // code fence lines
    .replace(/<\/?[a-z][a-z0-9-]*(?:\s[^>]*)?\/?>/gi, '') // real tags only, so "p < 0.05" survives
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links and images keep their text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*`]|(?<![A-Za-z0-9])_+|_+(?![A-Za-z0-9])/g, '') // emphasis, but keep snake_case
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const tokensIn = (markdown = '') => enc.encode(plainText(markdown)).length;

export function tokenCount(text = '') {
  const n = tokensIn(text);
  // Non-breaking space so "1.2k tokens" never splits across lines.
  return n < 1000 ? `${n}\u00a0tokens` : `${(n / 1000).toFixed(1)}k\u00a0tokens`;
}
