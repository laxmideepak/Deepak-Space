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

// Same tokenizer as GPT-4o. Runs at build time only, nothing ships to the browser.
const enc = new Tiktoken(o200k_base);

export const tokenize = (text: string) => enc.encode(text).map((t) => enc.decode([t]));

export function tokenCount(text = '') {
  // Count the words people read, not the markup inside figures.
  const prose = text.replace(/<figure[\s\S]*?<\/figure>/g, '');
  const n = enc.encode(prose).length;
  return n < 1000 ? `${n} tokens` : `${(n / 1000).toFixed(1)}k tokens`;
}
