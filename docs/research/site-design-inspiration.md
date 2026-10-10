# Site design inspiration: technical / ML-engineer aesthetic

Researched 2026-10-10. The font and colour facts come from fetching each site's HTML and CSS (`curl` plus grepping `font-family` and hex values) and from reading its homepage text. Hex lists are the most frequent values in each site's CSS, so they are only an approximation of the palette.

**Problem:** the current look (warm paper, Caveat handwriting, serif body) reads as soft. The fix is mostly typography: use a grotesk or mono for structure and labels, keep at most one serif for long reading, and cut the handwriting. Lee Robinson's site loads Caveat too, but only as an accent on a Geist sans base (leerob.com). Handwriting as the headline voice is what makes the site feel cute.

---

## 1. Real sites (verified)

| # | Site | Aesthetic in one line | Steal this |
|---|------|----------------------|------------|
| 1 | Andrej Karpathy, https://karpathy.github.io/ | Jekyll, Helvetica/Arial, white, grey `#505050`/`#999`. A single reverse-chron list: date, title, one-line summary. Footer tagline "Musings of a Computer Scientist". | A **date + title + one-line summary** list and nothing else. It is confident because it is bare. |
| 2 | Lilian Weng, https://lilianweng.github.io/ | Hugo PaperMod, system sans, dark `#2e2e33`. Nav: Posts / Archive / Search / Tags / FAQ. Each post shows date, reading time and author. | **Reading time + date metadata line** under each title, plus a top-level Search and Tags. |
| 3 | Chip Huyen, https://huyenchip.com/ | Lora serif, near-black `#111` on `#fdfdfd`, grey `#828282`. The homepage is a bio plus a short "AI Guide" link group. | A small **curated "start here" link group** (Roadmap / Good AI List / ML Interviews) above the bio. |
| 4 | Simon Willison, https://simonwillison.net/ | Georgia body with Helvetica UI. A dense stream grouped under day headings, plus a tag cloud with counts. | **Typed entries with a small label before the title** (Entry / Link / Quote / Note / TIL / Release). This maps directly onto learnings / thoughts / play. |
| 5 | Eugene Yan, https://eugeneyan.com/ | Merriweather serif + Raleway sans, Monokai code. Post lists are `date` in code style, a separator, then the title. | The **stats line** "212 posts, 31 talks, 19 prototypes, 426,689 words". A quantified-self footer fits an ML person. |
| 6 | Gwern, https://gwern.net/ | Source Serif 4 / Source Sans 3 / IBM Plex Mono, strictly monochrome (`#000`, `#fff`, greys), small caps, multi-column index, floating dark/reader toggle. | **Page metadata `status: in progress`, `confidence`, `importance`, created date.** This is the rigorous version of seedling/budding/evergreen. |
| 7 | Jay Alammar, https://jalammar.github.io/ | Bootstrap with Helvetica Neue body, **Roboto Mono** headings/nav, greys `#333`/`#666`. The posts are known for hand-drawn ML diagrams. | Mono for headings and nav over a plain sans body, a cheap way to signal "technical". |
| 8 | Chris Olah, https://colah.github.io/ | **Computer Modern Serif** (LaTeX font, self-hosted `cmun-serif`), white, `#555`. | It reads like an arXiv paper. Computer Modern for headings only signals "research" instantly. |
| 9 | Brandur, https://brandur.org/ | Tailwind ui-sans/serif/mono stacks. Light is a `#f6f5e9`→`#faf8fa` gradient, dark is `slate-800→950`. Sections: Articles / Atoms / Fragments / Sequences / Now / Uses. | **Named content types** (Atoms = micro-posts, Fragments = short essays) and a `[fragment]` label on each item in lists. |
| 10 | Dan Luu, https://danluu.com/ | Almost no CSS: a 22 KB page whose whole stylesheet is one `<style>` line. Each row is an `mm/yy` date column plus a link, with `color-scheme: light dark`. | **Fixed-width `09/26` date gutter.** Brutal honesty and speed are an aesthetic in themselves. |
| 11 | Niki Tonsky, https://tonsky.me/ | **IBM Plex Sans + IBM Plex Mono** throughout, loud yellow `#fddb29`, posts grouped by year with `m/d` dates. | Year headers with compact dates, and **one aggressive accent colour** on a neutral base. |
| 12 | Amos (fasterthanlime), https://fasterthanli.me/ | Berkeley Mono for code, Outfit + Commissioner (Google Fonts) for UI/display, burnt orange `#bc5c00` + indigo `#465aa4`. | A **geometric display sans + mono** pairing that feels engineered without feeling cold. |
| 13 | Transformer Circuits (Anthropic), https://transformer-circuits.pub/ | Tiempos Text serif + sans UI, cream `#faf9f5`, ink `#1f1f1e`. | The research-lab "editorial engineering" look: a serious serif on off-white with sans labels. |
| 14 | Bartosz Ciechanowski, https://ciechanow.ski/ | Inter + IBM Plex Sans (Google Fonts), white, steel blue `#4a79ad`, orange `#ef7f39`. | **Two-colour data accents** (blue/orange) that work for charts as well as UI. |
| 15 | Rauno Freiberg, https://rauno.me/ | Custom sans body, **JetBrains Mono** for mono, Georgia for serif, black `#000` with signal reds/yellows (`#ff484c`, `#ffef00`). Nav includes "Craft" and "Field Notes". | A terse **manifesto block** of seven imperative lines. Note that "Field Notes" is already his section name. |
| 16 | Mitchell Hashimoto, https://mitchellh.com/ | Inter UI + PT Serif reading, `#101828` ink on `#fafafa`. | A clean split: **sans for chrome, serif only inside articles.** |

Also checked: Lee Robinson https://leerob.com/ (Geist + Iowan Old Style + Caveat accent, green `#4f9442`) and the panr Hugo "Terminal" theme demo https://panr.github.io/hugo-theme-terminal-demo/, which shows a text logo, a `Menu ▾`, dashed-underline titles, `#tags` and `[Read more]` in brackets. Paco Coursey (https://paco.me/) is client-rendered. Its CSS shows an Inter display face, a Menlo mono and a near-pure greyscale palette (`#000`, `#1c1c1c`, `#fcfcfc`).

---

## 2. Aesthetic directions

### A. "Lab Log": data/grid with mono labels (recommended)
The site reads like an experiment tracker or W&B run page: a sans body, mono for every piece of metadata, hairline rules and a faint grid. It draws on Gwern's metadata, Eugene Yan's stats line, Dan Luu's date gutter and Tonsky's Plex.

- **Fonts:** `IBM Plex Sans` (body/UI) + `IBM Plex Mono` (labels, dates, code, nav). Optional headings in `IBM Plex Sans Condensed` 600.
- **Dark:** bg `#0E1116`, surface `#161B22`, border `#2A313C`, text `#E6EDF3`, muted `#8B949E`, accent `#3FB950` (signal green), accent-2 `#58A6FF`.
- **Light:** bg `#F7F7F5`, surface `#FFFFFF`, border `#E2E2DE`, text `#111418`, muted `#5C6370`, accent `#0A7F3F`, accent-2 `#1F6FEB`.
- **Growth stage:** a mono status chip, Gwern-style: `status: seedling` / `budding` / `evergreen`. It can also be drawn as a training metaphor, `epoch 1 ▱▱▱` → `epoch 3 ▰▰▰`, or as a 3-cell bar. Use colour only for evergreen (accent).
- **Tags:** bracketed mono labels before titles, Simon Willison / Brandur style: `[learning]`, `[thought]`, `[play]`.
- **Now box:** a bordered panel headed `// now`, with key-value rows in mono: `reading:`, `building:`, `training:` (sport), `playing:`, plus `updated: 2026-10-01`. A footer stats line in the Eugene Yan style: `42 notes · 18,400 words · last commit 3d ago`.

### B. Terminal / monospace dark
A dark-first site with mono everywhere. It works best when the copy is short and the site has a strong personality.

- **Fonts:** `JetBrains Mono` (everything) or `JetBrains Mono` headings/UI + `Inter` body for long reads (mono body tires readers on 2,000-word posts).
- **Dark:** bg `#0B0D0E`, text `#D7DAE0`, muted `#6B7280`, accent `#F5A623` (amber phosphor) or `#7EE787` (green), link underline `#3B82F6`.
- **Light (keep one):** bg `#FAFAF7`, text `#1A1A1A`, accent `#B45309`.
- **Garden:** the header is a prompt, `deepak@ml4h:~$ ls notes/ --sort=growth`. Growth stage becomes file-permission-ish glyphs (`·` seedling, `•` budding, `■` evergreen) or `-rw- draft` / `-r-- stable`. Tags are `#learnings` in accent. The Now box is a fake `$ cat now.txt` block. The Terminal theme's `[Read more]` brackets go on links.
- **Risk:** this look is common enough to be a cliché. Keep the gimmicks to the header and the Now box.

### C. Editorial engineering (research-lab journal)
Off-white, a serious serif for reading, sans and mono for chrome. It feels like Distill, Transformer Circuits or colah: technical through rigour rather than through darkness. It is the closest to the current site, but it ditches the handwriting and the warm "paper" tint.

- **Fonts:** `Source Serif 4` (body) + `Inter` or `IBM Plex Sans` (UI/headings) + `JetBrains Mono` (metadata/code). For a LaTeX nod, set the title in Computer Modern (self-host `cmun`, which is not on Google Fonts).
- **Light:** bg `#FAFAF8`, text `#1B1B1A`, muted `#6E6E69`, rule `#E4E2DC`, accent `#B3261E` (clinical red) or `#1D4ED8`.
- **Dark:** bg `#121212`, text `#E8E6E1`, muted `#9A9790`, accent `#F2726A`.
- **Garden:** a small caps metadata strip under the title, in Gwern's style: `SEEDLING · confidence: likely · 6 min · updated 2026-09`. Tags sit in a numbered "section" style. The Now box looks like a paper's abstract box: hairline border, an `Abstract`-style label reading "Now".

### D. Bold brutalist / Swiss
Big type, a strict grid, black and white plus one loud accent, in the spirit of Tonsky's yellow and Rauno's reds. It is the most masculine and distinctive option, and the hardest to keep readable.

- **Fonts:** `Space Grotesk` (700 headings, huge) + `Inter` (body) + `Space Mono` or `JetBrains Mono` (labels).
- **Light:** bg `#FFFFFF`, text `#000000`, accent `#FF4D00` (safety orange) or `#FDDB29`, rule 2px solid `#000`.
- **Dark:** bg `#000000`, text `#F2F2F2`, accent `#FF5A1F`.
- **Garden:** growth stage shown as a big numeral in the margin (`01 SEED`, `02 BUD`, `03 EVERGREEN`). Tags as full-caps blocks with an inverted background. The Now box is a thick-bordered card with an uppercase `NOW —` heading. Sports/games ("play") get the accent colour.

**Ranking for Deepak:** A (Lab Log) first. It is technical, ML-native, and it gives growth stage and tags a natural home. C second, as the "serious researcher" option with the least rework. B and D are higher risk: B is a cliché, D is hard to keep readable.

---

## 3. Name ideas

The top 5 are marked with ★.

| Name | Notes |
|------|-------|
| Deepak's Space | His idea. Friendly, but generic, and "space" is muddy without "latent". |
| Arena | His idea. Bold, and it fits sports/games, but it says competition rather than learning. Works better as a section name (e.g. the "play" section). |
| View | His idea. Too vague on its own. "Deepak's View" sounds like an op-ed column. |
| ★ **Latent Space** | The ML pun everyone in the field gets: the hidden representation behind the notes. **Caveat:** "Latent Space" is a well-known AI podcast/newsletter (latent.space), so a variant like **"Deepak's Latent Space"** or "latent/deepak" avoids the collision. |
| ★ **Signal / Noise** | Technical and readable to non-ML people. It also describes the curation (learnings = signal, life thoughts = some noise). |
| ★ **Lab Log** | Matches direction A exactly. Honest about the "notes in progress" garden format, with a clinical/research flavour. |
| ★ **Forward Pass** | ML term, and it reads as "moving forward" in life. It also has a sports meaning (a forward pass in football), which covers the "play" posts. |
| ★ **Inference** | Short and serious. Fits clinical prediction ("inference from notes") and "inferring" life lessons. |
| Gradient | Nice "small steps downhill" metaphor, but heavily used by companies (Gradient AI, The Gradient magazine). |
| Epoch | Clean, and it maps to growth stages (epoch 1→3). Many startups use the name. |
| Embeddings | Accurate, but plural and clunky as a title. |
| Field Notes | Good garden fit, but Rauno already uses it (rauno.me/notes) and it is a notebook brand. |
| Residual Stream | Very ML-nerdy (transformer internals). Good as a newsletter or "thoughts" section name. |
| Loss Curve | Self-deprecating and memorable. Slightly negative. |
| Checkpoint | It means "saved state of my thinking", so it suits a Now page or the whole site. |
| Attention Span | A pun on attention plus a life angle. Playful but still technical. |
| Out of Distribution | Good for life/sports posts that stray from ML. Long. |
| Ground Truth | Clinical/labelling flavour. Strong and somewhat masculine. |
| Hidden Layer | A plain "behind the scenes of me" pun. |
| Deepak Runs | Bare-name option ("runs" as in experiment runs and running). Simple. |

**Top 5 recap:** Latent Space (as a variant), Signal / Noise, Lab Log, Forward Pass, Inference. Pairings that work: **Lab Log** + direction A, **Forward Pass** + direction D, **Inference** + direction C.

Out of scope: no domain or trademark availability checks were done.
