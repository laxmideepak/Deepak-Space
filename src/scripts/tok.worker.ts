// Tokenizers for /try, built and run off the main thread so typing never waits on them.
// GPT-4o's table loads first; the GPT-4 and GPT-2 tables follow.
import { Tiktoken } from 'js-tiktoken/lite';

let o200k: Tiktoken | undefined, cl100k: Tiktoken | undefined, gpt2: Tiktoken | undefined;
let latest = '';

const MAX_SHOWN = 2000; // tokens drawn as chips; counts always cover the whole text

function reply() {
  if (!o200k) return;
  const ids = o200k.encode(latest);
  postMessage({
    text: latest,
    pieces: ids.slice(0, MAX_SHOWN).map((id) => o200k!.decode([id])),
    ids: ids.slice(0, MAX_SHOWN),
    total: ids.length,
    cl100k: cl100k?.encode(latest).length,
    gpt2: gpt2?.encode(latest).length,
  });
}

// Queued messages collapse into one reply for the newest text.
let scheduled = false;
onmessage = (e: MessageEvent<string>) => {
  latest = e.data;
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => { scheduled = false; reply(); }, 0);
};

(async () => {
  o200k = new Tiktoken((await import('js-tiktoken/ranks/o200k_base')).default);
  reply();
  cl100k = new Tiktoken((await import('js-tiktoken/ranks/cl100k_base')).default);
  gpt2 = new Tiktoken((await import('js-tiktoken/ranks/gpt2')).default);
  reply();
})();
