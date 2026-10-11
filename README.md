# Deepak's Tokenizer

Personal blog and digital garden of Deepak Nelapatla, ML engineer (ML4H, Broad Institute).
Live at **https://deepaktokenizer.vercel.app**.

The homepage is a ChatML turn scored by a small language model: the system prompt is shaded by how surprised the model was, and the reply decodes one token at a time, keeping the model's wrong guesses above my words.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

Pushing to `main` deploys to Vercel.

## Write a post

Add a Markdown file to `src/content/posts/`:

```md
---
title: "What I learned"
description: "One line for previews."
planted: 2026-10-12
stage: seedling        # seedling | budding | evergreen
tags: [learnings]      # learnings | thoughts
---

Text goes here.
```

Add `tended: <date>` when you revise a post. Token counts, the reading line, search, RSS and the boot screen pick it up automatically.

## Change the homepage

The system prompt and reply live in two places, and the build fails if they disagree:

1. Edit `SYSTEM` / `REPLY` in `src/pages/index.astro`.
2. Make the same edit in `scripts/export_inference.py`.
3. Re-score with the model (about a minute; downloads Qwen2.5-0.5B once):

```bash
pip install -r scripts/requirements.txt
python scripts/export_inference.py
```

This rewrites `src/data/inference.json`, the only thing the site reads.

## Where things are

| Path | What |
|---|---|
| `src/components/ChatTurn.astro` | Homepage: prefill heatmap, decode, popovers, ARGMAX, idle sampler |
| `src/pages/notes.astro` | All notes + regex-window search over the whole site |
| `src/pages/try.astro` | Tokenizer playground + in-browser "can a model predict you?" |
| `src/layouts/Base.astro` | Head, boot screen, `:` command line, plain mode |
| `src/styles/global.css` | All styles |
| `public/robots.txt` | Crawl rules, AI bot groups, Content Signals |
| `src/pages/sitemap.xml.ts` | Sitemap, rebuilt on every deploy |
| `src/pages/md/` + `middleware.ts` | Markdown version of every page, served for `Accept: text/markdown` |
| `docs/research/` | Design research behind the site |

Type `:` on any page for commands (`help`, `open`, `grep`, `temperature`, `plain`, `q`).
