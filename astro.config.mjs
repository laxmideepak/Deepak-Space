import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://deepaktokenizer.vercel.app',
  // /try's tokenizer worker dynamically imports its tables, which needs ES module workers.
  vite: { worker: { format: 'es' } },
});
