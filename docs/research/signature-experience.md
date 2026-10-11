# A signature experience for Deepak's Tokenizer

*Research brief · 2026-10-11 · for the site at https://deepaktokenizer.vercel.app (Astro 5, static, Vercel)*

**TL;DR.** Treat hancore.dev as a method to learn from. Copying its skin would make the site generic, which is the exact thing that sank the earlier "Lab Log" restyle. The recommendation is **deepak-24 (running)**: the homepage acts like an LLM inference call. A small open model tries to guess Deepak's own words as they decode, and each wrong guess falls on a part of the sentence that is specifically him. Phase 1 changes only the homepage and fits in a weekend. A plain-HTML `/notes` hub with a regex-window search comes after, and then a consistency chart once there is enough data to plot.

---

## 1. What hancore.dev actually does, and why it works

Source: the shipped code of https://hancore.dev/ (`glimpse.js`) and https://hancore.dev/site/ (`wheel.js`, `terminal.js`, `blueprint.js`, `bar.js`, `watch.js`, `worm.js`), read on 2026-10-11. The site is two static pages on Cloudflare Pages, written as hand-made vanilla ES modules with no framework, no bundler and no libraries.

| Piece | What you see | How it's built |
|---|---|---|
| **Code wall** (landing) | A wall of his real source code scrolls in a Neovim look | Canvas 2D character grid (IBM Plex Mono 12px, 7.2×13px cells, at most 112 columns). Three flat arrays (`chars`, `alphas`, `tints`) and dirty-rect repaint. `wall.json` is built at build time from 9 files pinned to commit SHAs and shuffled on every visit. One regex tokenizer sets each character's colour and alpha. |
| **Boot** | A fish prompt types `nvim ~/Projects`, then a statusline reading `NORMAL \| ~/P/r/path \| 16:40 4%` | The statusline is a DOM `<p>` snapped to the cell grid. Top/Bot/% and fish-style path shortening behave like the real tools. Any key skips the boot. |
| **Ghost director** | An invisible vim user edits the wall: `:colorscheme`, `d2j`, retyping with typos, then writes `// i build the things i want to use.` | Runs only while `calmNow()` holds: no scroll for 1.5s, no typing for 4s, tab visible, motion allowed. Each act checks a cancellation token. A `NEAR_KEYS` map supplies typos, and `keyDelay()` gives human pacing. |
| **Flux morph** | Every change scrambles through glyphs before it settles | One primitive: each cell passes through `░▒▓/\<>+=*#…` for 2–20 ticks of 50ms. The whole site moves with this one physics. |
| **Eye, hands, face** | An ASCII eye made of his code watches the caret. Skeletal hands type on a ghost keyboard. A face-tracking act plays. | Procedural iris quantised to 13 tones. The hands use MediaPipe's 21-point topology with spring fingertips, and `getLayoutMap()` shows the right key labels. The face is a **stock Pexels clip, not him**. |
| **`:theme`** | A colorscheme picker drawn inside the grid, with live preview | The 28 entries are his real Omarchy themes, parsed from `colors.toml` at build. Choosing one writes CSS variables. The link colour is picked by WCAG contrast ≥3 and CIELAB distance ≥15. |
| **Enter → eclipse/warp** | The text dissolves toward the eye, the eye zooms 64×, and 6,000 particles spiral into a black disc before `/site/` loads | Canvas 2D. Streaks are grouped into 10 `Path2D`s by glow level, so each frame needs only 10 stroke calls. Phones get 3,000 particles. Reduced motion navigates instantly. A `pageshow` handler cleans up after bfcache. |
| **Project wheel** (`/site/`) | Thumbnails on a curved wheel you scroll or drag | DOM `<button role=option>` tiles placed on a 520px circle. Critically damped spring (response 0.34). Selection commits after a 170ms debounce, so fast scrolling doesn't load every project. |
| **Ink-splatter arc** | Ink strokes and blooms behind the wheel | **This is his contribution calendar.** Each day maps to an angle, and stroke width follows the smoothed daily count. Runs of zero days leave gaps and peaks bloom. Seeded with mulberry32. |
| **Fish terminal** | `whoami`, `fetch <repo>` (a neofetch-style table), `ls links/`, `ls shots/` | DOM text, so it is selectable. Commands type at 18–34ms per character. `ls shots/` opens a screenshot viewer with a Sobel-edge "X-ray" sweep. |
| **Blueprint** | "HC grown toward 4'282 points · 1 point = 1 contribution", a "section A–A" cut and a "numeric twin" spec table | A space-colonization tree grows into his logo, with one attractor per contribution. A density cut follows the pointer, and there is a title block with mm dimensions. This is a mechanical engineer's native drawing format. |
| **Status bar and quirky states** | WORM lurking · EYE closed · GHOST idle · VISITORS sparkline | WORM is opt-in. It "eats" words using the CSS Custom Highlight API (the DOM is never changed), and GHOST then retypes them. Visitor counts come from a Cloudflare Function, edge-cached for 4h, captioned "no cookies · no stored IPs". |
| **"Live" GitHub stats** | Stars, repos, calendar | **Not live.** They come from a build-time snapshot (`fetchedAt` was 2026-10-04 when checked on 10-11), and the data says so honestly. |
| **Keys and `:cmd`** | `↑↓ project · ←→ shot · ↩ enter · : cmd` | j/k/h/l/g/G/Tab/Esc. `:colo`, `:e` and `:q` fail with real vim errors (E185, E484, E492). The hints change between fine pointer and touch. |
| **Stillness and mobile** | Fully still mode; phone layout | One `prefersStill()` helper checks the media query or a `?still` param: springs snap, the ghost never runs, the art is computed statically. Under 700px the wheel becomes a drawer and phones get half the particles. Height changes under 120px (URL bar) are ignored. |

**Why it works.** Every texture is his own material: his code, his themes, his contribution calendar, his logo. The metaphor is the environment he works in every day, rebuilt down to vim error codes, so people who live there recognise it at once. The ghost shows him working instead of describing him. Strict restraint (one font, one accent, everything on a 7.2×13 grid) makes the chaos read as craft.

**Where it's weak, so don't inherit it:**
- There is no writing at all.
- `/site/` is a JS-only shell with hash routes. Without JS it shows nothing, SEO is weak, and `sitemap.xml` returns 404.
- Body text is 12px mono drawn at 0.26–0.48 alpha, which is hard to read.
- On the landing, every printable key and Enter is hijacked.
- The terminal is `aria-live` while text types one character at a time, so screen readers chatter.
- About 450KB brotli on the landing, including an unused 236KB Archivo TTF.
- The hub blocks rendering on a top-level `await` of five JSON files.

**Transferable principles:**
1. **Use your real material as the texture.** For Deepak that means his posts, tokens, notebook pages, games and his leaderboard story. No stock content (hancore's stock face is the one place it breaks this rule, and it shows).
2. **Make every ornament a chart in disguise, and caption it honestly**, as in "1 point = 1 contribution".
3. **Pick one metaphor from his daily world and execute it with obsessive fidelity.** The earlier restyle failed because it was generic, not because it was a terminal. His world is tokenizers, sampling, logprobs, context windows and model cards, not vim.
4. **One autonomous ghost that shows him at work** and gives way the instant the visitor acts (`calmNow()` plus cancellation tokens).
5. **One transition primitive** for the whole site, plus critically damped springs for anything spatial.
6. **One obvious door**, with depth behind it, and hints in a bar that adapts to the input device.
7. **Stillness is a first-class mode**: one `prefersStill()`, rAF stops when idle, and everything pauses on `visibilitychange`.
8. **Use build-time snapshots stamped with `fetchedAt`**, and never claim "live" when it isn't.
9. **Keep the reading layer sacred.** Posts stay plain semantic HTML that works without JS.
10. **Write small dependency-free code, and do the boring performance work hancore skipped**: no unused fonts, no blocking awaits.

---

## 2. Inspiration board

| Site | What to steal |
|---|---|
| [bruno-simon.com](https://bruno-simon.com) | A permanent "I'm stuck" escape hatch, a "behind the scene" credits panel, and visitor whispers. Not the 4.9MB of 3D. |
| [henryheffernan.com](https://henryheffernan.com) | A loader that stays in character and prints real numbers ("loading o200k_base · 200k vocab OK"). Never a fake delay. |
| [dustinbrett.com](https://dustinbrett.com) | Show content in your field's own data structure: an archive that looks like a dataset viewer. Avoid its zoom lock and the OS-sized scope. |
| [lynnandtonic.com](https://lynnandtonic.com) | One cheap hidden gag aimed at insiders (about 1.6KB of JS), and yearly versions you can recast as checkpoints ("ckpt 2026.10"). |
| [joshwcomeau.com](https://www.joshwcomeau.com) | Interactive figures that carry the argument, and opt-in delight such as sound. |
| [jhey.dev](https://jhey.dev) | Astro with a live status block. **Copy its accessibility pattern exactly**: real text in `aria-label`, the scramble `aria-hidden`, motion gated on `motion-safe`. |
| [rauno.me](https://rauno.me) | A tick-ruler minimap that becomes reading progress measured in tokens. |
| [wattenberger.com](https://wattenberger.com) | ML ideas turned into objects you can touch, and the "Please, no fish" button, which becomes **"Please, no tokens"**. |
| [ciechanow.ski](https://ciechanow.ski) | Figures that move only when the reader moves them, mounted lazily (`client:visible`). |
| [bbycroft.net/llm](https://bbycroft.net/llm) | "Every number shown is real", taken from a real forward pass. Skip the WebGL. |
| [Transformer Explainer](https://poloclub.github.io/transformer-explainer/) | A temperature slider that visibly sharpens or flattens the probabilities, and precomputed examples shown before any model loads. |
| [tiktokenizer](https://tiktokenizer.vercel.app/) | Show the ChatML template literally (`<|im_start|>system…`), with a text/IDs toggle. |
| [OpenAI tokenizer](https://platform.openai.com/tokenizer) | The byte-fallback moment. His version: **దీపక్ is 15 → 10 → 3 tokens** across gpt2 → cl100k → o200k (re-verified in this repo). |
| [Distill: augmented RNNs](https://distill.pub/2016/augmented-rnns/) | One ink colour, thin lines, generous whitespace. Restraint reads as taste. |
| [Distill: feature viz](https://distill.pub/2017/feature-visualization/) | A "watch it converge" scrub where the reader controls time. |
| [TF Playground](https://playground.tensorflow.org/) | Shareable state in the URL hash, and a quiet epoch counter. |
| [Transformer Circuits](https://transformer-circuits.pub/2025/attribution-graphs/biology.html) | Prose as the interface: hover a phrase and the evidence card appears. A clean, content-first index. |
| [Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) | A consistent figure grammar that becomes a house style over time. |
| [llm.c #481](https://github.com/karpathy/llm.c/discussions/481) | The pipe-separated training-log line as a statusline: `step … \| ctx … tok \| …`. |
| [nanoGPT](https://github.com/karpathy/nanoGPT) | Samples from a model trained on your own text. Fine for the 404 later, but the corpus is tiny for now. |
| [W&B](https://wandb.ai/) | Raw curve plus EMA with a smoothing slider, and adjective-noun-N run names. |
| [micrograd](https://github.com/karpathy/micrograd) | Smallness as a value: state how few KB each piece costs. |

---

## 3. The three concepts

| Concept | Taste lens (fit / wow / read / feasibility) | Build lens (fit / wow / read / feasibility) |
|---|---|---|
| **A. deepak-24 (running)** | **9 / 8 / 6 / 5** | **9 / 8.5 / 8 / 6** |
| B. Chart Review | 7 / 6 / 8 / 7 | 7 / 7 / 7 / 6.5 |
| C. steady-cricket-24 | 8 / 8 / 7 / 5 | 7.5 / 7.5 / 7 / 5 |

Both judges independently picked **A as the spine, cut down hard**, with B's search and C's eval swap and smoothing chart grafted on.

### A. deepak-24 (running)

**One-liner.** The homepage is a live inference run of a model called deepak-24. A small draft model keeps trying to guess his next words, and his real words override the guesses.

**Metaphor.** The site is a forward pass and Deepak is the model: ChatML, prefill, decode, logprobs, temperature, KV cache, speculative decoding and `<|endoftext|>`. **The ghost is speculative decoding with Deepak as the target model.** At build time a small open model is teacher-forced on his sentences. Where it guesses right, the token solidifies. Where it guesses wrong (say "trials" after "I build models that read clinical"), the guess dissolves and his real word lands. The bar shows "α 0.58": 42% of him is not what a small model expects. No other site can have his rejections.

**Landing.** Tagline: **"one token at a time."** It is autoregression stated as his consistency goal.

```
deepak-24 · one token at a time                 o200k · ctx 128k · T 0.7
<|im_start|>system
You are Deepak, an ML engineer on the ML4H team at the Broad Institute. …
<|im_end|>
<|im_start|>assistant
I build models that read clinical▌ ·trials ·data ·text     ← draft ghost, faint
Off the clock: cricket, badminton, volleyball. Always up for a game.
   notes ↩      now      about                                  <|im_end|>
recent context ── The leaderboard picked the wrong winner   130 tok  budding …
DECODE 38/52 · 12 tok/s (slowed 4×) │ KV cold │ T 0.7 │ DRAFT α 0.58
```

Prefill brightens the whole prompt at once, one step per layer, because prefill really is parallel. Decode then runs one token at a time, as decode really does. Hovering a token shows its real top-5 with the label "teacher-forced · the text is mine, the probabilities are qwen's". A return within 5 minutes counts as a **KV hit**: the page renders final and shows "prefill skipped".

**Entrance: ARGMAX.** Enter on `notes ↩` anneals T from 0.7 to 0. Each token's alpha becomes `softmax(score/T)`, so the screen really sharpens the way a softmax does. Survivors stream into the winning chip `" notes"`, and the native cross-document view transition morphs that chip into the hub heading. It takes about 1.3s. At T ≥ 1 it *samples* the destination instead, so you might land on `/about`. Under reduced motion it navigates instantly.

**Hub (`/notes`).** The posts are drawn as one packed training sequence:

```
deepak-24 / notes                                T 0.7 · o200k · ctx 529/128k
CONTEXT · packed, 4 docs              │ In [3]: deepak.read("benchmarks-…")
   0 ┤ ▍system  deepak.card()      64 │ The leaderboard picked the wrong winner
  64 ┤▶▍The leaderboard picked…   130 │ budding · learnings · Oct 10 · 130 tok
     │ ▍<|endoftext|>                 │ most surprising token: " Gemma" 11.2 bits
 194 ┤ ▍Don't send the whole note 137 │
 593 ┤ ░░░ 127,407 tok free · fits 215×│ In [4]: ▌
TRAINING RUN steady-cricket-24 ● running ▁▂▁▃▅▂▁▁▄▆▃▂   smoothing [──●──]
step 593 │ ctx 0.5% │ T 0.7 │ KV warm ·3 │ PITCH rain stopped play │ DRAFT idle
```

**Live and quirky states:**
- **KV**: cold, hit, warm ·3, or evicted, from localStorage. It never leaves the browser.
- **T**: 0.0 still, 0.7, or 1.4 HALLUCINATING. At high T, curated absurd lines appear, such as "I build cricket that reads volleyball notes."
- **PITCH**: Open-Meteo weather for Boston: "rain stopped play", "bad light".
- **WEIGHTS**: "fine-tuning 1d" when a post changed recently, otherwise "frozen".
- **DRAFT**: speculating, accepted 3/4, or rejected.
- **Idle ghost**: resamples one true slot (cricket ↔ badminton ↔ volleyball).
- **404**: `loss: nan │ KeyError`.

**Keys and commands:**
- Tab gives the tokens a single roving tab stop: ←/→ moves between tokens and ↑/↓ switches attention heads.
- `:temperature`, `:open`, `:tokenizer` (precomputed), `:ids` (real o200k IDs: `40 3024 7015 484 1729 17356 12870 13`), `:plain`, `:q`.
- Errors are real Python exceptions: `NameError: name 'foo' is not defined`.

**Reading mode.** Posts stay untouched apart from a faint `ctx 64 / 130 tok · budding` log line at the bottom and the "Please, no tokens" toggle.

**Mobile.**
- The system turn collapses into a `<details>`.
- Tapping a token opens a bottom sheet. Attention shows as highlights rather than arcs.
- The bar shrinks to two cells.
- The hub's context column becomes a horizontal tick ruler.

**Build plan.** One offline Python export (target plus draft model) writes `inference.json`. A build guard fails the build if the JSON's text doesn't match the rendered copy. Components: `Prompt`, `Decode`, `StatusBar`, `still.ts`, a lazy `argmax.ts`, `notes.astro` with a REPL and a training-run chart. Roughly 10 days in three phases.

**Risks:**
- **Honesty.** The model only scored his words. Label it.
- **Tokenizer mismatch.** o200k's weights aren't public. Check that the open model splits the line the same way.
- **Gimmick fatigue** and **keyboard hijack.**
- **Clone risk**, because the bar and `:` commands echo hancore.

**Judges' cut/fix:**
- Cut the attention arcs and head cycling. Attention from a 0.5B model with the sink removed is the least honest number on the page, and arcs break when the line wraps.
- Cut the typed prompt. It needs a lazy 1.1MB o200k ranks load, which is more than 100× the site's current JS, and the "retrieval" reply over 4 posts is a costume.
- Remove the referrer and visit count from the user turn. It reads as surveillance.
- Fix contrast: mono at 0.55 alpha on #161616 fails. Use `--muted` at full opacity.
- Never hide server-rendered text. Tokens start at faint ink, never at opacity 0 and never on the h1, which protects LCP.
- Decode at most 2 lines, about 2s, and let any key, scroll or tap finish it.
- **Gate:** run the export first. If the misses land on punctuation or function words instead of words like " cricket", the hook doesn't work. Rewriting his own copy is fine. Cherry-picking models or thresholds to make it look better is not.
- Add a one-line legend for non-ML visitors.
- Cut the IPython REPL, the training chart (there is 1 day of data), PITCH (a third-party request that exposes visitor IPs for a joke), counters, deepak-char, `:seed`, and URL-hash state.

### B. Chart Review

**One-liner.** The site is the long-term record of one self-consented subject, himself. You can re-identify him, scroll back through his history, and search it the way he searches EHR notes.

**Metaphor.** Chart review is his actual job: read years of notes about one person and predict what happens next. Posts are encounter notes, notebook pages are scanned documents, games are an activity track, the `tended` date becomes an addendum, and the stage words map to draft, preliminary and signed. It predicts habits, never health, and every snippet is synthetic.

**Landing.** Tagline: **"read me over time."**

```
ENCOUNTER NOTE                                   DE-IDENTIFIED · o200k
2026-10-11 09:41 ET · note 5 of 5 · scribe: ambient (it's me)
SUBJECT     ██████ █████████ · ██ y/o · ML engineer
SITE        █████ ████████ ██ ███ ███ ███████ · ML4H
CHIEF COMPLAINT  "I build models that read clinical notes."      8 tokens
ASSESSMENT  Consistent at work. Working on consistency in life.
PLAN        1. Keep writing.  2. Read me over time.
[ ↩ open chart ]   latest: The leaderboard picked the wrong winner →   just the notes ↓
```

**Entrance: RE-IDENTIFY → LOOKBACK**, about 2.4s, in place. The redaction bars split into o200k pieces (`Deep|ak| Nel|apat|la`) and flux-decode into his name. The note shrinks with a FLIP into the newest tick, the timeline sweeps right to left through his years, and the index line drops in at today.

**Hub.**

```
LOOKBACK ─────────────────────────────────────────┤ INDEX ┆ PREDICTION
        2019   2020   2021   2022   2023   2024   2025  2026┃ 10-11 ┆ → 11-10
NOTES                                              ▮▮▮▮ ┃
PLAY    ●  ◆ ●●   ▲  ●  ◆◆  ●  ▲ ●●  ◆  ●  ◆◆●  ▲●◆ ●◆   ┃
LIFE    ├── B.Tech ECE · JNTU ──┤├─ M.S. CS · UTA ─┤├ Broad┃
grep /smok|tobacco/  ±20 ━●━   5 hits · sent 139 / 529 tok · saved 73.7%
ENCOUNTERS [all] learnings thoughts play │ P(new note) 0.50 · P(game/wk) 0.91
CHART D.N. 24y │ 4 notes · 529 tok │ last note 1d │ STREAK 1* HS 1 │ INDEX today
```

**Live and quirky states:**
- STREAK in cricket notation: `3*` (not out), `HS 9`, `OUT · 12d gap`.
- WASHOUT for planned breaks.
- LEAKAGE when you drag the index past today.
- A DE-ID toggle that uses the Custom Highlight API.
- Habit predictions that score themselves (Brier) against the last window.

**Keys and orders:** j/k for notes, `/` to grep, `[ ]` to move the index, `d` for de-id. `:grep`, `:index` and `:window` place "orders", and errors show the browser's real `SyntaxError`.

**Reading mode.** An "ENCOUNTER · date · budding (preliminary) · 130 tok" header, a token ruler, and a grep-arrival chip that links back to the search.

**Mobile.** The timeline turns vertical as year rows, with a full-width index range and a sticky grep.

**Build plan.** `record.csv`, `chart.js` (pure predict/streak/deid functions), a build-time SVG timeline, and a lazy `chart.json`. About 9 days.

**Risks.** Tone next to his real depression and stroke research, employer optics around anything EHR-styled, sparse data, and the upkeep of `record.csv`.

**Judges' cut/fix:**
- **The first paint redacts his name, which works against identity.** A homepage's first job is to show the name.
- Casting himself as the patient ("SUBJECT", "CHIEF COMPLAINT") is clinically cold.
- Predictions are all priors: 4 posts, all dated 2026-10-10.
- The entrance is too small to remember.
- **Keep:** the regex-window extraction search. It is his "Don't send the whole note" post turned into real search, and both judges rated it the best single interactive across the three concepts. The LEAKAGE joke and cricket-notation streaks are also worth keeping.

### C. steady-cricket-24: his life, logged as a training run

**One-liner.** The homepage is a training run of his life. Loss measures inconsistency, posts are checkpoints, and sports are the validation sets.

**Metaphor.** Nobody judges a run by one step; you judge it by the smoothed curve. Loss is 1 minus the share of {write, ship, play} done that day. Lineage is written like a model's training history: `init b.tech ece · jntu → ft m.s. cs · uta → ft ml4h · broad`. Training steps are tokens written (529 today). The eval is his leaderboard story.

**Landing.** Tagline: **"# consistency is what survives smoothing"**.

```
deepak/life                                              BOS 22:14 · run 24
$ python train.py --run steady-cricket-24 --resume
  loaded ckpt 4 · "The leaderboard picked the wrong winner" · 529 tok seen
        Deepak Nelapatla
        I build models that read clinical notes.          8 tokens
        # consistency is what survives smoothing
  0.5 ┤ ╲____·___ ·__◆◆◆◆___╲● 0.41 ┄┄┄┄ (future: cosine schedule)
       2025-10        2026-04        2026-10-10 · warmup
  resume ↩                                        just the posts →
```

A canvas "log wall" of his real events in llm.c dialect scrolls behind. A trainer ghost replays events, runs the eval swap, and samples the hero line at temperature.

**Entrance: ANNEALED DESCENT.** 3,000 Langevin walkers fall down a loss landscape with one well per checkpoint and depth proportional to tokens, while T anneals to 0. The hub is revealed from the point where they converge.

**Hub.**

```
Deepak Nelapatla   ● running deepak/life/steady-cricket-24
consistency / loss        smoothing ━━━●━ .90 │ system prompt (ChatML)
 · raw (1 dot = 1 day)  — ema  ◆ ckpt  ▲ val  │ val sets: cricket ▲·▲·  last 2d
checkpoints  step  title                  tok │ eval [leaderboard] real notes
             529 ▸ The leaderboard…       130 │  1 qwen-3.6   2 gemma-4  ← swaps
TRAINING │ step 529 · loss 0.41 (ema .90) │ RUN running · VAL sat W · FAN idle
```

**Live and quirky states:**
- RUN: running, or "stalled 9d · resuming is the whole point".
- VAL: "none 14d · overfitting to work".
- FAN: the ghost's activity.
- GRAD: the visitor's scroll speed ("clipped 1.00").
- A `loss: nan` meltdown at T above 2.

**Commands.** `:temperature 0` returns HF's real `ValueError` and actually turns motion off. Also `:eval`, `:smooth`, `:resume`, `:q` → "KeyboardInterrupt · checkpoint saved".

**Reading mode.** A `step ≈64/130 tok · ckpt 4` run line, and an end mark reading "ckpt saved · next →".

**Mobile.** A stacked hub. The chart uses `touch-action: pan-y` so a horizontal drag scrubs. The bar becomes a tap-to-expand sheet.

**Build plan.** `run.log`, a GitHub GraphQL snapshot and a nightly deploy hook, build-time SVG plus marching-squares contours, and a `glimpse.ts` of about 700 LOC. About 9–13 days.

**Risks.** The Lab Log trap all over again, empty data at launch, a public stall meter, and the most expensive canvas work of the three.

**Judges' cut/fix:**
- A W&B dashboard is generic to every ML engineer.
- The log wall copies hancore, and the typed `python train.py` boot is the fake-terminal trope he already rejected.
- The Langevin descent is a common ML-viz trope and mixes training imagery into an inference brand.
- Cut GRAD (it measures readers), FAN and NaN.
- The life chart is empty for months.
- **Keep:** the eval FLIP swap, which tells his best story in two rows, ranks only. Keep the tagline and the smoothing slider (show them once there are about 60 days of data), and temperature as the single motion knob.

---

## 4. Recommendation: build deepak-24, cut down to its spine

**Why this one.** Speculative decoding with Deepak as the target is the only mechanic of the three that no one else can copy. It also grows out of what is already shipped. The Now box in `src/pages/index.astro` already opens "You are Deepak…", and `Tokens.astro` already splits the hero into 8 o200k tokens. Post token counts and the tokenized 404 already exist. It's a continuation of the site, not a new costume.

**Gate, before writing any UI.** Run the export. Look at *where* the 0.5B model guesses wrong. If the misses fall on words like " clinical", " notes", " cricket" or " badminton", go ahead. If they fall on "." or " that", rewrite the second line (the text is his, so that's honest) or fall back to the plain token hover.

### 4.1 Screens

**Home `/`.** The h1 stays first, and his words sit above the fold on a 1280×800 screen.

```
Deepak's Tokenizer                                       notes   about    :
─────────────────────────────────────────────────────────────────────────────
Deepak Nelapatla                                        ← h1, never animated
<|im_start|>system
You are Deepak, an ML engineer on the ML4H team at the Broad Institute. You are
currently predicting late-life depression and stroke from longitudinal EHR notes,
playing cricket, badminton and volleyball, and thinking about building
consistency in life.                                           updated Oct 2026
<|im_end|>
<|im_start|>assistant
I build models that read clinical notes.▌ ·trials ·data             8 tokens
Off the clock: cricket, badminton, volleyball. Always up for a game.
faint = what a 0.5B model guessed I'd say · where it's wrong, that's me
                                              notes ↩               <|im_end|>
Notes ───────────────────────────────────────────────────────────────────────
The leaderboard picked the wrong winner                      130 tok  budding
Don't send the whole note                                    137 tok  budding
For extraction, the smarter model earned its keep            151 tok  budding
Instruct model or smart model?                               111 tok  budding
─────────────────────────────────────────────────────────────────────────────
DONE 18 tok · α 0.58 │ T 0.7 │ KV cold                                 : cmd
```

Behaviour:
- **0ms.** The whole page is server-rendered. Reply tokens show at "prefill ink" (opacity about 0.35, never 0). Links and the post list are clickable immediately.
- **200–500ms, prefill.** The system block brightens in one step per model layer (the layer count comes from `inference.json`). CSS only.
- **500–2500ms, decode** at 12 tok/s, labelled as slowed. The caret walks forward with the draft's next k=4 tokens shown faint ahead of it.
  - A match goes solid in the existing `t0–t3` tints.
  - A miss strikes the draft token through, flux-dissolves it through 2–3 real o200k pieces (about 150ms), and lands his token with a flash of `#60a5fa`.
- **Done.** The bar reads `DONE 18 tok · α 0.58`, and `sessionStorage.kv` is set so the rest of the session renders final with the line "KV hit · prefill skipped".
- **Any key, scroll or tap** jumps to the final state.
- **Popover** on hover, focus or tap:

```
 " notes"   p 0.31 · 1.7 bits
  notes   ████████░░ 0.31
  data    █████░░░░░ 0.19
  text    ███░░░░░░░ 0.12
 teacher-forced · the text is mine, the probabilities are Qwen2.5-0.5B's
```

  The numbers above are placeholders. The build guard stops placeholders from shipping.

**`/notes`: the context window.** A real `<ol>` that needs no JS, plus a grep search taken from Chart Review.

```
notes                                            529 / 128,000 tok · 4 docs
grep /smok|tobacco/▌                 window ±20 ━━●━━━━━  (native range 5–150)
5 hits in 3 notes · sent 139 / 529 tok · saved 73.7%   ███████░░░
  Don't send the whole note  …For [smoking], the pipeline looks like…  →
─────────────────────────────────────────────────────────────────────────────
   0 ┤▍The leaderboard picked the wrong winner             130 tok  budding
     │ <|endoftext|>
 130 ┤▍For extraction, the smarter model earned its keep   151 tok  budding
 …
 529 ┤░░░ 127,471 tok free · fits 240×
```

- Position IDs are cumulative o200k counts from `tokenCount()`.
- Each row's height comes from a CSS variable `--tok`.
- Search results show only ±W-token windows around each match and link with `#:~:text=` fragments, so the browser scrolls to and highlights the match itself. They reuse the `.in/.out/mark` styles from the "Don't send the whole note" figure.
- At ±150 a note appears: "my posts are ~130 tokens, shorter than one window. This pays off on 3,000-token clinical notes."
- The 73.7% figure was measured by the concept research on today's 4 posts. Re-measure it at build.

**Posts `/posts/[slug]`.** Nothing hijacked and no motion. One line pinned to the bottom in Geist Mono at `--faint`: `ctx 64 / 130 tok · budding · <|endoftext|> in 66`.
- A CSS `animation-timeline: scroll()` hairline, with about 10 lines of JS for the number.
- The body gets matching `padding-bottom`, so the line never covers text.
- It collapses to `ctx 49%` under 400px and hides under `:plain`.

**`/about`.** Add a model card table: params 24 years · pretraining B.Tech ECE, JNTU Hyderabad · fine-tune M.S. CS (AI/ML), UT Arlington · deployed ML4H, Broad Institute · eval "the leaderboard picked the wrong winner" · known issues: always up for a game. Then a name line computed at build:

> Deepak Nelapatla: 7 → 5 → 5 tokens. దీపక్: 15 → 10 → 3. My name got 5× cheaper between GPT-2 and GPT-4o.

These numbers were verified with js-tiktoken in this repo. No new font is needed, because system fonts cover Telugu.

**404.** Keep "This page isn't in my vocabulary." and add the mono line `loss: nan · KeyError: '/foo'`.

**Leaderboard post.** An inline eval swap taken from concept C: a checkbox styled as `split: [leaderboard] real clinical notes`, and Qwen and Gemma rows that swap with a CSS `:has()` translate transition. It needs zero JS and works as raw HTML in Markdown. It shows ranks only, matching what the post publishes.

### 4.2 Interactions

| Where | Input | Effect |
|---|---|---|
| Home | Tab | Moves to the token line, which is one roving tab stop. ←/→ moves between tokens, the popover follows (`aria-describedby`), and Esc leaves. |
| Home | ↩ on `notes ↩`, or click | **ARGMAX**: a 600ms DOM softmax anneal of token opacities, then a native view transition that morphs the chip into the `/notes` h1 (`view-transition-name: argmax`). |
| Anywhere | `:` (body focus, no modifiers) or the visible `: cmd` button | Opens a one-line command field in the bar. |
| `/notes` | `/` | Focuses grep. Esc clears it. |
| Posts | (none) | Native scrolling only. |

**Commands** match by prefix, and errors are Python exceptions.
- `:temperature 0.2` (or `:t`) sets the motion knob. `:temperature 0` returns HF's real "`temperature` (=0.0) has to be a strictly positive float" warning, and it really does turn motion off.
- `:open lead` opens a post. A miss gives `FileNotFoundError: no doc matching 'xyz'`.
- `:card` opens the model card.
- `:plain` means "Please, no tokens". It also disables every single-key shortcut, which covers WCAG 2.1.4.
- `:help`.
- `:q` prints `<|endoftext|>`.
- Anything else gives `NameError: name 'foo' is not defined`.

**Stillness.** One `prefersStill()` returns true for the reduced-motion media query, `?still`, `T === 0`, or `:plain`. When it does, the page shows the final state, with no ghost, no anneal and plain navigation.

**Mobile.**
- The system turn becomes one `<details>` line.
- Tapping a word opens the popover as a bottom sheet.
- The bar is one line with `safe-area-inset`.
- Touch targets are at least 44px, and pinch-zoom is never locked.

### 4.3 Data sources

| Data | Source | When |
|---|---|---|
| Top-5 logprobs, draft guesses (k=4), α | `scripts/export_inference.py` (Qwen2.5-0.5B on CPU, own venv) → `src/data/inference.json` (about 3KB) | Offline; rerun when the hero copy changes, which takes about a minute |
| Token pieces and counts | `tokenize()` / `tokenCount()` in `src/lib.ts` (o200k, js-tiktoken) | Build |
| Posts, stage, dates | Content collection via `getPosts()` | Build |
| Name tokenizations | js-tiktoken `gpt2` / `cl100k_base` / `o200k_base` | Build |
| KV visit state, T, plain mode | sessionStorage / localStorage in try/catch; never sent anywhere | Client |
| GitHub calendar (Phase 3) | GraphQL snapshot stamped with `fetchedAt` | Nightly build |
| Games and notebook pages (Phase 3) | `src/data/run.log`, one hand-written line per event | On commit |

**α, defined honestly:** the share of his tokens that matched the model's greedy guess under teacher forcing. The proposals for the accepted prefix are exactly the teacher-forced argmax, so no second model is needed. Only the 3 discarded tail tokens after each miss need a small `generate`.

### 4.4 Phased plan

**Phase 1, MVP in a weekend (homepage only; JS ≤6KB gzip; posts unchanged)**
- *Saturday*
  - `scripts/export_inference.py` and `scripts/requirements.txt`. Teacher-force the system turn plus the hero line plus one more line. Emit `{model, layers, text, tokens[], top5[], draft[], alpha}`. Assert that the model splits the line into the same pieces as o200k. If not, emit the model's own tokens and set a flag that the caption reports.
  - `src/components/Tokens.astro`. Add a `decode` prop that reads `inference.json`, and **throw at build if its text doesn't match `text`**.
  - `src/pages/index.astro`. Reorder to h1, then system turn, then assistant reply. Wrap the Now box in `.chatml` tag spans.
  - `src/styles/global.css`. Add `.chatml{color:var(--faint)}`, put the Now text at `--muted` with full opacity, and add the prefill-ink and decode classes.
- *Sunday*
  - The inline `<script>` in `Tokens.astro`, about 120 lines: decode, draft ghost, flux, popover, roving focus, skip-on-input.
  - `src/scripts/still.ts`: `prefersStill()` and a T store.
  - `src/components/StatusBar.astro`, mounted from `src/layouts/Base.astro` on the homepage only: three `aria-hidden` cells plus an `aria-label` summary.
  - A footer "Please, no tokens" button that sets `html.plain`.
- *Done when:*
  - It works fully with JS off.
  - Reduced motion shows the final frame.
  - LCP is unchanged and there is no layout shift.
  - The real sentence stays in the existing `sr-only` span.
  - There is no `aria-live` on the stream.

**Phase 2: the hub and the commands (about a week of evenings, after living with Phase 1 for a week)**
- `src/pages/notes.astro`: the packed-context `<ol>` plus grep, about 120 lines of inline script.
- `src/pages/notes.json.ts`: a prerendered endpoint, built the same way as `llms.txt.ts`, holding `[{slug,title,pieces[]}]` (about 6KB). It is fetched lazily on first focus of grep.
- ARGMAX: the DOM anneal plus `view-transition-name` on the home chip and the `/notes` h1. The existing `@view-transition` rule handles the rest.
- `src/scripts/cmd.ts`: the `:` command line and Python errors, mounted inside `StatusBar.astro`.
- `src/pages/posts/[...slug].astro`: the ctx reading line.
- `src/pages/about.astro`: the model card and the name tokenization line.
- `src/content/posts/benchmarks-picked-the-wrong-winner.md`: the CSS-only eval swap.
- `src/pages/404.astro`: `loss: nan · KeyError`.
- Decide whether the homepage keeps the full list (see Q4).

**Phase 3: life (data-gated and optional)**
- `src/scripts/argmax.ts`: lazy canvas glyph particles, at most 1,200 (400 on phones), 8 alpha buckets, removed on a bfcache `pageshow`.
- An idle single-slot resampler gated by `calmNow()` and cancellation tokens. It swaps only true facts (cricket ↔ badminton ↔ volleyball).
- T ≥ 1.3 "HALLUCINATING" with curated lines, and sampled ARGMAX destinations at T ≥ 1.
- **The consistency chart on `/notes`, only after about 60 days of data.** Sources: `src/data/run.log`, `scripts/github-snapshot.mjs` as a `prebuild` step (needs `GITHUB_TOKEN`), and `.github/workflows/nightly.yml` calling a Vercel deploy hook. It plots raw dots plus EMA with a native smoothing slider, captioned **"consistency is what survives smoothing"**. The streak uses cricket notation: `3* · HS 9 · OUT 12d gap · washout`.

**Cut outright:**
- The typed prompt, the 1.1MB ranks download and the retrieval reply.
- Attention arcs and head cycling.
- The IPython REPL.
- Open-Meteo PITCH by default.
- Visitor and token counters, which would force a serverless adapter plus Upstash.
- deepak-char.
- `:tokenizer qwen/gemma` (Gemma's tokenizer is gated on Hugging Face).
- URL-hash state and `:seed`.
- The redacted-name landing, self-scoring predictions, the scribe and DE-ID.
- The Langevin descent, the log wall, GRAD and FAN.
- Any referrer or visit-count copy.

**Budget:** no new fonts, no WebGL, no new npm dependencies, and nothing on the page waits on the network.

---

## 5. Open questions for Deepak

1. **Tagline:** "one token at a time." (the inference brand), "consistency is what survives smoothing" (best saved as the chart caption later), or "read me over time."?
2. **Second decoded line:** which sentence follows the hero? Choose it *after* the export shows where the small model gets you wrong. Are you willing to rewrite copy so the misses land on words that are really you?
3. **How playful:** default T of 0.7 with a "HALLUCINATING" easter egg ("I build cricket that reads volleyball notes."), or a dry site where T only controls motion?
4. **Home vs `/notes`:** keep the full post list on the homepage and make `/notes` the search and archive, or show 4 recent posts on home and put the full list on `/notes`?
5. **Consistency chart:** would you log games and notebook pages as one line each in `run.log`, and are you comfortable with a public "stalled 9d" state? The alternatives are GitHub-only data or no chart at all.
6. **GitHub data:** add a read-only token to Vercel plus a nightly rebuild, or skip GitHub entirely?
7. **Personal details:** is it fine to show your age (deepak-24, versioned on your birthday) and Boston local time?
8. **Weather and counters:** do you want the "rain stopped play" PITCH cell (a third-party request that reveals each visitor's IP to Open-Meteo) or any visitor counter (needs a backend)? Both are cut by default.
