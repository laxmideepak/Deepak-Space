import { getPosts, plainText, tokenize } from '../lib';

// Every note as its GPT-4o tokens, for the regex-window search on /notes.
// Fetched only when someone focuses the search box.
export async function GET() {
  const notes = (await getPosts()).map((p) => ({
    id: p.id,
    title: p.data.title,
    pieces: tokenize(plainText(p.body)),
  }));
  return new Response(JSON.stringify(notes), { headers: { 'Content-Type': 'application/json' } });
}
