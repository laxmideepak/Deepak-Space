# UI polish ideas for Deepak's Tokenizer

## 1. Summary and first batch

The site already has a strong visual unit: the tinted GPT-4o token. The best small changes carry that unit to places it doesn't reach yet (tab icon, text selection, focus ring, 404 page, share card). They also fix the spots where the signature breaks: phones never see it, screen readers may not announce it, and one figure label gets cut off. Every item below except the copy button (#25) is CSS, markup or build-time Astro. None needs a JS framework. Snippets use the real selectors in `src/styles/global.css`, `index.astro`, `Base.astro`, `PostList.astro` and `posts/[...slug].astro`.

**First batch** (no client JS, about 60 lines of CSS, one SVG, one new page):

1. **Token-chip favicon and theme-color** (#1). It replaces the generic globe on every tab and bookmark.
2. **Token-blue `::selection`** (#2). It's two rules, and copying a sentence looks like tokenizing it.
3. **Accessible intro markup plus the left-to-right token stream** (#4 + #3, one edit to `index.astro`).
4. **Token count visible on touch screens** (#8). Phone visitors currently never see the signature.
5. **View-transition crossfade on `<main>`** (#5). Ship the crossfade only; add the title morph later.
6. **Tokenized 404 page** (#7). Unknown URLs currently get Vercel's plain-text 404.
7. **Agreement-bar clipping fix** (#6). The label reads "disagre" on phones today.

## 2. Ranked shortlist

| # | Idea | Category | Effort | JS? | Avg |
|---|------|----------|--------|-----|-----|
| 1 | Token-chip SVG favicon and theme-color | meta-polish | S | no | 8.7 |
| 2 | Token-tinted text selection | typography | S | no | 8.0 |
| 3 | Tokenize as a stream (staggered tints) | llm-identity | S | no | 8.0 |
| 4 | Fix the intro's accessible name | accessibility | S | no | 7.7 |
| 5 | Cross-document view transitions | motion | S | no | 7.7 |
| 6 | Fix the clipped "disagree" label | figures | S | no | 7.7 |
| 7 | Tokenized 404 page | llm-identity | S | no | 7.7 |
| 8 | Token count visible on touch | accessibility | S | no | 7.3 |
| 9 | Open Graph/Twitter meta and canonical URL | meta-polish | S | no | 7.3 |
| 10 | Balanced headings, pretty paragraphs | typography | S | no | 7.3 |
| 11 | 2px token-blue focus ring | accessibility | S | no | 7.0 |
| 12 | Split `--faint` into text gray and hairline | accessibility | S | no | 7.0 |
| 13 | Curly quotes, `<time>`, no-break token counts | typography | S | no | 6.7 |
| 14 | Opt-in motion instead of the reduced-motion kill switch | accessibility | S | no | 6.7 |
| 15 | Model-card colophon on /about | llm-identity | S | no | 6.7 |
| 16 | Notes-list hover fix and spotlight | interaction | S | no | 6.3 |
| 17 | Labels for the cost-bar figure | accessibility | S | no | 6.3 |
| 18 | Token reveal on first paint (touch) | llm-identity | S | no | 6.0 |
| 19 | `<\|endoftext\|>` end-of-post mark | llm-identity | S | no | 6.0 |
| 20 | Previous/next notes with token counts | navigation | S | no | 5.7 |
| 21 | Consistent fading underlines | links-buttons | S | no | 5.0 |
| 22 | Figure bars reveal on scroll | figures | S | no | 5.0 |
| 23 | Single-token isolation on hover | interaction | S | no | 5.0 |
| 24 | Speculation Rules prerender | navigation | S | no | 4.7 |
| 25 | Copy-email button | links-buttons | S | yes | 4.7 |
| 26 | /llms.txt | meta-polish | S | no | 4.7 |
| 27 | `scrollbar-gutter: stable` | meta-polish | S | no | 4.3 |
| 28 | Motion tokens | motion | S | no | 4.3 |
| 29 | Token-chip skip link | accessibility | S | no | 4.0 |
| 30 | Bigger touch targets for nav links | accessibility | S | no | 4.0 |

## 3. Ideas in rank order

### 1. Token-chip SVG favicon and theme-color
**What and why.** The project has no `public/` directory and no icon link, and `/favicon.ico` returns 404. Design-engineer sites use simple shape-only SVG favicons ([rauno.me](https://rauno.me/favicon.svg), [devouringdetails](https://devouringdetails.com/favicon.svg), [paco.me](https://paco.me/favicon.svg)). Use shapes rather than text, because an SVG favicon can't load web fonts. Safari draws a white plate behind low-contrast favicons, so fill the square and use saturated colors ([Paco](https://paco.me/writing/safari-favicon-showing-white-background)). Three chips in the full-strength token colors make the smallest possible "Tokenizer" logo.

`public/favicon.svg`. The gaps are 3 units (about 1.5px at 16px) so the chips don't smear into one bar:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#161616"/>
  <rect x="2"  y="9" width="12" height="14" rx="2.5" fill="#60a5fa"/>
  <rect x="17" y="9" width="6"  height="14" rx="2.5" fill="#fbbf24"/>
  <rect x="26" y="9" width="4"  height="14" rx="2"   fill="#4ade80"/>
</svg>
```
`Base.astro` `<head>`:
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" /> <!-- one-off 180px export -->
<meta name="theme-color" content="#161616" />
```
**Support.** SVG favicons work in Chrome 80+, Firefox 41+ and Safari 26+ ([caniuse](https://caniuse.com/link-icon-svg)). `theme-color` is used by Chrome Android on regular pages ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color)).
**Caveats.** Skip the `.ico`: Safari 26 reads SVG, and older Safari falls back to the apple-touch-icon. Safari caches favicons aggressively, so clear its cache to check the result. Sources: [MDN rel=icon](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel#icon), [Vercel guidelines](https://github.com/vercel-labs/web-interface-guidelines).

### 2. Token-tinted text selection
**What and why.** The OS selection blue is the only color on the site that isn't from its palette. Many sites set their own selection color ([brianlovin](https://brianlovin.com), [joshwcomeau](https://www.joshwcomeau.com), [leerob](https://leerob.com), [vercel](https://vercel.com/), [cursor](https://cursor.com/)). [jakub.kr](https://jakub.kr) hides the selection blocks at line breaks. Blue at 32% alpha over `--bg` blends to about `#2e445f`. `#ededed` on that is 8.5:1, which clears the 4.5:1 that [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/::selection) asks for.
```css
::selection { background-color: rgb(96 165 250 / .32); color: var(--text); }
br::selection { background: transparent; }
```
**Support.** Chrome, Firefox 62+ and desktop Safari. iOS Safari ignores it and keeps the system highlight ([caniuse](https://caniuse.com/css-selection)).
**Caveats.** Use one selection color only. All three judges dropped the amber system-prompt variant.

### 3. Tokenize as a stream: stagger the tints on hover/focus
**What and why.** All 8 tints currently appear at once. Staggering them 35ms apart (about 280ms in total), with "8 tokens" last, reads like a tokenizer emitting output. Emil Kowalski recommends a 30–80ms stagger for group entrances ([skill](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md)). Josh Comeau shows giving hover-in and hover-out different timings by putting the extra timing only on the `:hover` rule ([css-transitions](https://www.joshwcomeau.com/animation/css-transitions/)). Transitions can be interrupted mid-way, which keyframes can't, so a quick mouse pass reverses smoothly ([Vercel](https://github.com/vercel-labs/web-interface-guidelines)). Rauno recommends offsetting siblings in time ([Depth](https://rauno.me/craft/depth)).

This needs the `--i`/`--n` markup from #4. Keep the existing `.25s ease` transition (Emil uses plain `ease` for color) and add:
```css
@media (prefers-reduced-motion: no-preference) {
  .tokens:is(:hover, :focus) > span[class^="t"] { transition-delay: calc(var(--i) * 35ms); }
  .tokens:is(:hover, :focus) .count { transition-delay: calc(var(--n) * 35ms); }
}
```
**Caveats.** The base rule's `transition` shorthand resets the delay to 0, so leaving clears every tint at once ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-delay)). On touch screens this only matters if #18 ships.

### 4. Fix the tokenized intro's accessible name
**What and why.** `index.astro` puts `aria-label` on a `<p>`. ARIA 1.2 lists `paragraph` among roles that cannot be named ([naming prohibited](https://www.w3.org/TR/wai-aria-1.2/#namefromprohibited), [paragraph](https://www.w3.org/TR/wai-aria-1.2/#paragraph)). Screen readers may therefore announce nothing for the only sentence that says what Deepak does, even though the element still takes a Tab stop. Perplexity's hero uses the safe pattern: the full sentence in a visually hidden span, with the visual pieces `aria-hidden` ([perplexity.ai](https://www.perplexity.ai/)).
```astro
<p class="tokens" tabindex="0" style={`--n:${tokens.length}`}>
  <span class="sr-only">{intro}</span>
  {tokens.map((t, i) => <span class={`t${i % 4}`} style={`--i:${i}`} aria-hidden="true">{t}</span>)}
  <span class="count" aria-hidden="true">{tokens.length} tokens</span>
</p>
```
```css
.sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; border: 0;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
.tokens .sr-only { user-select: none; }   /* otherwise copying the line gives the sentence twice */
```
**Caveats.** Remove `aria-label`. `span[class^="t"]` doesn't match `sr-only`, so the tint rules are unaffected ([MDN aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)).

### 5. Native cross-document view transitions
**What and why.** One CSS rule makes same-origin navigations animate ([Chrome docs](https://developer.chrome.com/docs/web-platform/view-transitions/cross-document), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition)). [shud.in](https://shud.in) crossfades only the article column with a soft blur. [maxleiter.com](https://maxleiter.com) keeps it short. [jhey.dev](https://www.jhey.dev), also an Astro site, guards it for reduced motion. Rauno's [interaction design](https://rauno.me/craft/interaction-design) essay says to show where things come from, and his [Novelty](https://rauno.me/craft/novelty) essay warns against showy transitions on every page. Astro's docs say its ClientRouter will increasingly become unnecessary ([docs](https://docs.astro.build/en/guides/view-transitions/)).

**Step 1: the crossfade.**
```css
@view-transition { navigation: auto; }
main { view-transition-name: page; }   /* header and footer stay still */
@media (prefers-reduced-motion: no-preference) {
  ::view-transition-old(page) { animation: .2s ease both vt-out; }
  ::view-transition-new(page) { animation: .3s .05s ease both vt-in; }
}
@keyframes vt-out { to   { opacity: 0; filter: blur(4px); } }
@keyframes vt-in  { from { opacity: 0; filter: blur(4px); } }
```
**Step 2 (optional): the title grows from its list row into the post's h1.** Set `style={`view-transition-name: post-${p.id}`}` on `.post-title` in `PostList.astro` and `style={`view-transition-name: post-${post.id}`}` on the `<h1>` in `[...slug].astro` ([view-transition-name](https://developer.mozilla.org/en-US/docs/Web/CSS/view-transition-name)). Then add:
```css
.post-header h1 { width: fit-content; }
::view-transition-group(*) { animation-duration: .25s; animation-timing-function: cubic-bezier(.2,0,0,1); }
@media (prefers-reduced-motion: reduce) { .post-title, .post-header h1 { view-transition-name: none !important; } }
```
**Support.** Chrome/Edge 126+ and Safari 18.2+. Firefox navigates normally ([caniuse](https://caniuse.com/cross-document-view-transitions)).
**Caveats.** Ship step 1 alone first. The morph scales a bitmap of a one-line 1rem row up to a 3rem h1 that may wrap to two lines on phones, so it can look stretched or blurry. Test at 375px. I swapped the original ease-in exit for `ease` so there's no ease-in anywhere (see #28). Under reduced motion the default plain fade stays, which matches Chrome's guidance that reduced motion means less movement, not zero fades ([same-document guide](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)).

### 6. Fix the clipped "disagree" label on phones
**What and why.** At 375px on `/posts/smarter-model-for-extraction`, `.fig-bar-rest` overflows its bar by about 17px and gets cropped to "disagre". The agree and range segments use `flex: 0 0 70%/10%` and can't shrink. The rest segment's default `min-width: auto` won't let it get narrower than its text, about 77px against 60px available ([flexbox spec](https://www.w3.org/TR/css-flexbox-1/#min-size-auto)).
```css
.fig-bar-rest { min-width: 0; }
@media (max-width: 520px) { .fig-bar-rest { color: transparent; } }   /* add to the existing 520px block */
```
**Caveats.** The second rule is required. With `min-width: 0` and `justify-content: flex-end`, the text would spill left over the striped range ([MDN min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)). The scale row, the caption and the bar's `aria-label` already carry the meaning.

### 7. A 404 page that speaks tokenizer
**What and why.** Astro builds `src/pages/404.astro` to `404.html`, and Vercel serves that automatically ([Astro docs](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page)). The copy joke is accurate: byte-level BPE has no unknown token, but tokenizers that do have one call it `unk_token` ([Hugging Face](https://huggingface.co/docs/transformers/main_classes/tokenizer)). Pill links as next steps follow [openai.com](https://openai.com/).
```astro
---
import Base from '../layouts/Base.astro';
import { tokenize, TAGS } from '../lib';
const line = 'This page isn’t in my vocabulary.';
const t = tokenize(line);
---
<Base title="Not found">
  <section class="hero">
    <h1>404</h1>
    <p class="tokens is-lit"><span class="sr-only">{line}</span>{t.map((s, i) => <span class={`t${i % 4}`} aria-hidden="true">{s}</span>)}<span class="count" aria-hidden="true">{t.length} tokens</span></p>
    <p class="intro">Byte-level BPE never hits an unknown token. This URL did.</p>
  </section>
  <p class="pills">{TAGS.map((x) => <a href={`/tags/${x}`}>{x}</a>)}<a href="/">home</a></p>
</Base>
```
This CSS replaces the four `.tokens:hover .tN` rules and the box-shadow rule, so it removes more code than it adds:
```css
.t0 { --tint: var(--t0); } .t1 { --tint: var(--t1); } .t2 { --tint: var(--t2); } .t3 { --tint: var(--t3); }
.tokens:is(:hover, :focus, .is-lit) > span[class^="t"] { background: var(--tint); box-shadow: 1px 0 0 var(--bg); }
.tokens.is-lit .count { opacity: 1; }
.pills { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 2rem; }
.pills a { border: 1px solid var(--line); border-radius: 99px; padding: .3rem .85rem; font-size: .85rem; color: var(--muted); text-decoration: none; }
.pills a:hover { border-color: var(--faint); color: var(--text); }
```
**Caveats.** The links sit in a `<p>`, not a `<nav>`, because the global `nav` styles would otherwise restyle them. Copy the token markup inline for now. Extract a `Tokens.astro` component only when a third use appears (two of three judges agreed).

### 8. On touch screens, show the token count
**What and why.** `.count` sits at `opacity: 0` behind `:hover`/`:focus`, so a 375px screenshot shows the intro as plain text. [henry.codes](https://henry.codes) hides hover-only details only on devices that can hover. [paco.me](https://paco.me), [emilkowal.ski](https://emilkowal.ski) and [leerob.com](https://leerob.com) put their hover styles inside `(hover: hover)`, which also stops hover states sticking on iOS after a tap.
```css
@media (hover: none) { .tokens .count { opacity: 1; } }
@media (hover: hover) { .post-list a:hover .post-title { color: var(--muted); } }  /* move the existing rule here, or replace it with #16 */
```
**Support.** The `hover` media feature works in Chrome 38+, Safari 9+ and Firefox 64+ ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover)).
**Caveats.** I dropped the blur-in count: its `:focus-visible` didn't match the existing `:focus` rule, so a mouse click would show the count still blurred. I also left out permanent tints, which #18 covers if wanted. Use this or #18 for touch screens, not both.

### 9. Share card: Open Graph/Twitter meta and canonical URL
**What and why.** `Base.astro` emits only a title and description, so links shared in Slack, LinkedIn and X unfurl as bare text ([ogp.me](https://ogp.me/), [X cards](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup)). `site` is already set in `astro.config.mjs`.
```astro
interface Props { title?: string; description?: string; type?: 'website' | 'article' }
const { title, description = …, type = 'website' } = Astro.props;
const canonical = new URL(Astro.url.pathname.replace(/(.)\/$/, '$1'), Astro.site);
---
<link rel="canonical" href={canonical} />
<meta property="og:type" content={type} />
<meta property="og:site_name" content="Deepak’s Tokenizer" />
<meta property="og:title" content={title ?? 'Deepak’s Tokenizer'} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonical} />
<meta property="og:image" content={new URL('/og.png', Astro.site)} />
<meta name="twitter:card" content="summary_large_image" />
```
In `[...slug].astro`, use `<Base … type="article">`.
**Caveats.** Pass `type` explicitly. If it's derived from `title`, /about and the tag pages would be marked "article". The real work is designing one static 1200x630 `public/og.png` showing the tinted intro. Skip per-post satori images ([Astro endpoints](https://docs.astro.build/en/guides/endpoints/)). Separate cleanup: both `/posts/x` and `/posts/x/` return 200. Add `vercel.json` with `{ "trailingSlash": false }` and drop the slash from the RSS link ([Vercel](https://vercel.com/docs/project-configuration/vercel-json#trailingslash); Astro's own option doesn't apply to prerendered pages, per [Astro config](https://docs.astro.build/en/reference/configuration-reference/#trailingslash)). Feed readers may show existing items as new once after that change.

### 10. Balanced headings, no orphans in prose
**What and why.** [joshwcomeau](https://www.joshwcomeau.com/css/custom-css-reset/) and [leerob](https://leerob.com) set `balance` on headings and `pretty` on paragraphs. At 375px the tagline leaves "notes." alone on its own line, and the 3rem post titles leave dangling words. `balance` applies only to short blocks (up to 6 lines in Chromium), and `pretty` costs some layout time ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)).
```css
h1, h2, .tokens, .post-title, .fig figcaption { text-wrap: balance; }
.prose p, .prose li, .intro, .system-prompt p { text-wrap: pretty; }
body { font-synthesis-weight: none; }   /* only Geist 400/500 are loaded */
```
**Support.** `balance`: Chrome 114+, Firefox 121+, Safari 17.5+. `pretty`: Chrome 117+ and Safari 26+ ([caniuse](https://caniuse.com/css-text-wrap-balance)).
**Caveats.** The invisible `.count` still takes up space, so `balance` on `.tokens` counts it when choosing line breaks. Check at 375px. Leave `hanging-punctuation` ([shud.in](https://shud.in)) until posts have blockquotes.

### 11. A 2px token-blue focus ring
**What and why.** Today's `1px solid var(--muted)` ring is easy to miss next to 1px `--line` row borders. [rauno.me](https://rauno.me) and [paco.me](https://paco.me) use bolder rings, and WCAG 2.4.13 (AAA) asks for a 2px perimeter ([Understanding](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html)). Solid `#60a5fa` measures 7.1:1 on `--bg` and 6.7:1 on `--raised`.
```css
:focus-visible { outline: 2px solid #60a5fa; outline-offset: 3px; border-radius: 2px; }  /* --t0 at full strength */
```
**Caveats.** Keep the existing 2px radius. A bigger global radius reshapes the bordered post rows while they're focused. Don't animate `outline-offset`; focus should appear instantly. Outlines, unlike box-shadow rings, survive forced-colors mode ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible)).

### 12. Split `--faint` into a readable gray and a decorative hairline
**What and why.** `#5f5f5f` measures 2.83:1 on `--bg` and 2.67:1 on `--raised`, below the 4.5:1 minimum ([WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)). Yet it carries the token counts, stage words, fact labels, captions and the `01` counters, which are the site's signature metadata. Raise `--muted` as well so the two grays stay distinct:
```css
--muted: #a3a3a3;    /* 7.17:1 on bg, 6.76:1 on raised */
--faint: #868686;    /* 4.97:1 on bg, 4.68:1 on raised */
--hairline: #5f5f5f; /* decorative only */
```
Point `a { text-decoration-color }` and `.fig-branches::before { border }` at `--hairline`.
**Caveats.** Use `#868686`, not `#838383`: the latter is 4.496:1 on `--raised`, and WCAG doesn't round up. Check the list and facts rows by eye afterward. `.fig-note-text .out` keeps its deliberate opacity fade.

### 13. Curly quotes, `<time>` dates, no-break token counts
**What and why.** Astro's smartypants curls quotes in Markdown only ([docs](https://docs.astro.build/en/guides/markdown-content/)). "Deepak's Tokenizer" therefore ships with a straight apostrophe in `Base.astro` (both `fullTitle` strings, the RSS link title and `.site-name`), in `about.astro` ("I'm", "That's", the quoted "tokenizer") and in `rss.xml.js`. Vercel's guidelines ask for curly quotes and a non-breaking space between a number and its unit ([guidelines](https://github.com/vercel-labs/web-interface-guidelines)).
```astro
<dd><time datetime={planted.toISOString().slice(0, 10)}>{fmt(planted)}</time></dd>   <!-- same for tended -->
```
In `lib.ts` `tokenCount`, write `` `${n}\u00a0tokens` `` in both branches so "1.2k tokens" never splits across lines.
**Caveats.** The ISO date slice matches `fmt`'s UTC formatting ([MDN time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)). I left out `tabular-nums`, which has almost no visible effect on a one-line facts row.

### 14. Opt-in motion instead of the reduced-motion kill switch
**What and why.** `* { transition: none !important; }` removes harmless color fades. It doesn't touch `animation`, view-transition pseudo-elements or `::before`/`::after`, since `*` doesn't match pseudo-elements, so new motion would slip past it. The recommended pattern is to write motion inside `no-preference` ([Josh Comeau](https://www.joshwcomeau.com/react/prefers-reduced-motion/), [web.dev](https://web.dev/articles/prefers-reduced-motion)). Reduced motion means less movement, not zero fades ([Emil](https://github.com/emilkowalski/skills/blob/main/skills/review-animations/STANDARDS.md)).

Delete the block. Keep color and opacity transitions global. Put anything that moves (transforms, blur, clip-path, keyframes, staggers) inside `@media (prefers-reduced-motion: no-preference) { … }`, as #3, #5, #18 and #22 already do.
**Caveats.** Only needed once motion items land. After deleting, grep for `transform` and `@keyframes` to confirm each sits inside `no-preference` ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)).

### 15. A colophon on /about written like a model card
**What and why.** Paco's redesign post ends with a colophon listing typefaces, stack and hosting ([paco.me](https://paco.me/writing/redesign-2021)). Written as a model card, it turns Deepak's stack into identity and explains the token counts. It needs no new CSS.
```astro
<h2>Colophon</h2>
<dl class="post-facts">
  <div><dt>Tokenizer</dt><dd>o200k_base (GPT-4o) via js-tiktoken, counted at build</dd></div>
  <div><dt>Type</dt><dd>Funnel Display, Geist, Geist Mono</dd></div>
  <div><dt>Built with</dt><dd>Astro, no client JS</dd></div>
  <div><dt>Hosted on</dt><dd>Vercel</dd></div>
</dl>
```
**Caveats.** It can replace the existing "Lengths are counted in tokens…" sentence. "No client JS" stops being true if #25 ships.

### 16. Notes-list hover: brighten the hovered row instead of dimming it
**What and why.** `.post-list a:hover .post-title { color: var(--muted) }` lowers contrast under the cursor, so the row reads as disabled. Vercel says hover should raise contrast ([guidelines](https://github.com/vercel-labs/web-interface-guidelines)). [leerob.com](https://leerob.com) dims the other rows instead, and Josh Comeau recommends a fast enter with a slower exit ([css-transitions](https://www.joshwcomeau.com/animation/css-transitions/)).
```css
/* delete: .post-list a:hover .post-title { color: var(--muted); } */
.post-title, .post-meta { transition: color .3s ease; }
.post-list a:focus-visible .post-meta { color: var(--muted); }
@media (hover: hover) and (pointer: fine) {
  .post-list a:hover .post-meta { color: var(--muted); }
  .post-list a:hover :is(.post-title, .post-meta) { transition-duration: .12s; }
  .post-list:has(a:hover) a:not(:hover) .post-title { color: var(--muted); }  /* optional */
}
```
**Support.** `:has()` works in Chrome 105+, Safari 15.4+ and Firefox 121+ ([caniuse](https://caniuse.com/css-has)).
**Caveats.** Never fade other rows to `--faint`; that fails contrast. The sibling fade is optional on a four-row list.

### 17. Label the cost bars like the agreement bar
**What and why.** `.fig-cost` in `dont-send-the-whole-note.md` shows 100% vs 25% only through bar width. Rauno gives a decorative HTML figure one descriptive label ([nextjs](https://rauno.me/craft/nextjs)), and Vercel says not to rely on size or color alone ([guidelines](https://github.com/vercel-labs/web-interface-guidelines)).
```html
<div class="fig-cost" role="img" aria-label="Tokens sent: whole note 100%, window only about 25%">
  <div class="fig-cost-row"><span>Whole note</span><div class="fig-cost-bar" style="--w: 100%"></div><span class="fig-cost-val">100%</span></div>
```
```css
.fig-cost-row { grid-template-columns: 6rem 1fr 2.5rem; }
.fig-cost-val { font-family: var(--mono); color: var(--faint); text-align: right; }
```

### 18. First-paint token reveal (touch screens only)
**What and why.** The intro paints tinted, and the tints fade away left to right, using one keyframe with `backwards` fill ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode)). This is a variation on Streamdown's streamed-text animation ([docs](https://streamdown.ai/docs/animation)). It uses `--tint` from #7 and `--i` from #4.
```css
@media (hover: none) and (prefers-reduced-motion: no-preference) {
  .tokens > span[class^="t"] { animation: settle .8s ease-out calc(.35s + var(--i) * 45ms) backwards; }
}
@keyframes settle { from { background-color: var(--tint); } }
```
**Caveats.** This is an alternative to #8, not an addition. Don't use the opacity-plus-blur "stream in" variant, because it hides the main text on first paint. The animation overrides `:hover` for up to about 1.3s, and it replays on every homepage visit, so don't stack it with other entrance motion.

### 19. `<|endoftext|>` as the end-of-post mark
**What and why.** In o200k_base, the tokenizer this site already uses, `<|endoftext|>` is special token 199999 ([tiktoken](https://github.com/openai/tiktoken/blob/main/tiktoken_ext/openai_public.py)). It works like a magazine's end-of-article mark that only ML readers will catch.
```astro
<p class="eot" aria-hidden="true"><|endoftext|></p>   <!-- after .post-body, before #20 -->
```
```css
.eot { margin: 3rem 0 0; font: .7rem var(--mono); color: var(--faint); }
```
**Caveats.** Keep it static. All three judges dropped the hover tint on a non-interactive element.

### 20. Previous/next notes at the end of posts
**What and why.** Posts currently dead-end. rauno.me/craft articles close with a previous/next row ([example](https://rauno.me/craft/interaction-design)). Showing the token counts reuses the list's data style.
```astro
const all = await getPosts();
const i = all.findIndex((p) => p.id === post.id);
const prev = all[i - 1], next = all[i + 1];   // neighbors in list order (last tended), not chronology
---
<nav class="post-nav" aria-label="More notes">
  {prev && <a href={`/posts/${prev.id}`} rel="prev"><span class="dim">previous · {tokenCount(prev.body)}</span>{prev.data.title}</a>}
  {next && <a href={`/posts/${next.id}`} rel="next" class="right"><span class="dim">next · {tokenCount(next.body)}</span>{next.data.title}</a>}
</nav>
```
```css
.post-nav { display: flex; gap: 1.5rem; margin-top: 4rem; padding-top: 1.25rem; border-top: 1px solid var(--line); font-size: .9rem; }
.post-nav a { display: grid; gap: .2rem; text-decoration: none; color: var(--text); }
.post-nav .right { margin-left: auto; text-align: right; }
.post-nav .dim { font: .75rem var(--mono); color: var(--faint); }
@media (max-width: 520px) { .post-nav { flex-direction: column; } .post-nav .right { margin-left: 0; text-align: left; } }
```
**Caveats.** Two long titles overflow at 375px without the column rule. The global `nav` styles also apply here, so check them. With only four posts the benefit is modest.

### 21. Consistent fading 1px underlines
**What and why.** Underline colors are inconsistent today, and they snap on hover. [emilkowal.ski](https://emilkowal.ski) uses font-relative underline offsets. [paco.me](https://paco.me) fades 1px underlines over .24s.
```css
a { text-decoration-thickness: 1px; text-underline-offset: .22em; transition: text-decoration-color .3s ease, color .3s ease; }
a:hover { transition-duration: .12s; }
.post-facts dd a { text-decoration-color: var(--muted); }
```
**Caveats.** I dropped the external-link ↗ arrow, since no post has external links. The drawn nav underline ([henry.codes](https://henry.codes)) is optional and must sit inside `no-preference` ([MDN text-underline-offset](https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset)).

### 22. Figure bars draw themselves on scroll
**What and why.** Animation earns its place when it explains something ([Emil](https://emilkowal.ski/ui/you-dont-need-animations)), and these bars are about size. A `view()` timeline needs no JS ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline/view)). `clip-path` avoids squashing the mono labels the way `scaleX` would.
```css
@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {
  .fig-bar, .fig-cost-bar { animation: bar-in 1ms linear both; animation-timeline: view(); animation-range: entry 20% cover 45%; }
  .fig-cost-bar { animation-name: bar-in-pill; }
} }
@keyframes bar-in { from { clip-path: inset(0 100% 0 0 round 6px); } to { clip-path: inset(0 round 6px); } }
@keyframes bar-in-pill { from { clip-path: inset(0 100% 0 0 round 99px); } to { clip-path: inset(0 round 99px); } }
```
**Support.** Chromium 115+ and Safari 26+. Firefox only behind a flag.
**Caveats.** `animation-timeline` must come after the `animation` shorthand, which resets it ([animation-range](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-range)). The bars un-draw when the reader scrolls back up, which can feel gimmicky.

### 23. Single-token isolation with a visible leading space
**What and why.** tiktokenizer isolates the hovered token and shows its spaces as "⋅" ([source](https://github.com/dqbd/tiktokenizer/blob/master/src/sections/TokenViewer.tsx)). OpenAI's tokenizer page explains that the leading space belongs to the token ([OpenAI](https://platform.openai.com/tokenizer)).
```css
.tokens:has(> span[class^="t"]:hover) > span[class^="t"]:not(:hover) { background: transparent; }
```
**Caveats.** The craft judge voted skip: it only works with a mouse and needs fiddly markup. The leading-space span (`<span class="ws"> </span>`) may be removed by Astro's `compressHTML`, and moving the pointer onto `.count` flashes all the tints back. Revisit only after #3.

### 24. Speculation Rules prerender
**What and why.** A JSON rules block, which runs no JS, prerenders a link after a 200ms hover in Chrome. It pairs well with #5 ([Chrome](https://developer.chrome.com/docs/web-platform/prerender-pages)), whereas Astro's `prefetch` injects a script ([Astro](https://docs.astro.build/en/guides/prefetch/)).
```html
<script type="speculationrules" is:inline>
{"prerender":[{"where":{"and":[{"href_matches":"/*"},{"not":{"href_matches":"/rss.xml"}}]},"eagerness":"moderate"}]}
</script>
```
**Caveats.** The pages are tiny static files, so the gain is small. Prerenders can inflate pageview counts if analytics are added later.

### 25. Copy-email button
**What and why.** rauno.me stacks "Email" and "Copied" in one grid cell, so swapping them causes no layout shift, and announces the result through `aria-live` ([rauno.me](https://rauno.me)). Emil says a copy action should show a success state ([tips](https://emilkowal.ski/ui/7-practical-animation-tips)). Keep the mailto `<a>`, and keep the button `hidden` until the script runs ([Astro scripts](https://docs.astro.build/en/guides/client-side-scripts/)).
```js
for (const b of document.querySelectorAll('[data-copy]')) {
  b.hidden = false; const s = b.nextElementSibling; let timer;
  b.addEventListener('click', async () => {
    clearTimeout(timer);   // rapid clicks must not let an old timer clear the new "copied" state
    try { await navigator.clipboard.writeText(b.dataset.copy); b.dataset.copied = ''; s.textContent = 'Email copied'; }
    catch { s.textContent = 'Copy failed'; }
    timer = setTimeout(() => { delete b.dataset.copied; s.textContent = ''; }, 1500);
  });
}
```
**Caveats.** This would be the site's first client JS, and the effort judge voted skip. Put the `translateY` label swap inside `no-preference`, and don't use `all: unset`, which removes the focus ring ([MDN writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)).

### 26. /llms.txt
**What and why.** [llmstxt.org](https://llmstxt.org/) proposes a Markdown index of a site for models. Being model-readable fits a site called Tokenizer.
```ts
// src/pages/llms.txt.ts
import { getPosts } from '../lib';
export async function GET() {
  const rows = (await getPosts()).map((p) => `- [${p.data.title}](https://deepaktokenizer.vercel.app/posts/${p.id}): ${p.data.description}`);
  return new Response(`# Deepak’s Tokenizer\n\n> Notes by Deepak Nelapatla, ML engineer (clinical NLP).\n\n## Notes\n\n${rows.join('\n')}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
```
**Caveats.** It isn't UI. Skip the per-post `.md` copies, since `post.body` contains the raw figure HTML. Serve `text/plain`, because browsers tend to download `text/markdown` instead of showing it.

### 27. `scrollbar-gutter: stable`
**What and why.** [leerob.com](https://leerob.com) and [joshwcomeau.com](https://www.joshwcomeau.com) reserve the scrollbar gutter, so on Windows the centered column doesn't jump about 15px between short and long pages. That jump is more noticeable during view transitions.
```css
html { scrollbar-gutter: stable; }
```
**Caveats.** Skip custom scrollbar colors. `<meta name="color-scheme" content="dark">` already gives dark native scrollbars, and `thin` shrinks the drag target. Supported in Chrome 94+, Firefox 97+ and Safari 18.2+ ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)).

### 28. Motion tokens
**What and why.** Emil uses one strong ease-out as the UI default, plain `ease` for color, and never ease-in ([skill](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md)). Vercel says never use `transition: all` ([guidelines](https://github.com/vercel-labs/web-interface-guidelines)).
```css
:root { --ease-out: cubic-bezier(.23,1,.32,1); }
```
**Caveats.** Add it only when a second transform-based transition needs it, and skip the duration scale. #5 already uses no ease-in.

### 29. Skip link styled as a token chip
**What and why.** Vercel's guidelines ask for a skip link ([guidelines](https://github.com/vercel-labs/web-interface-guidelines)). Styled as a tinted mono chip, it gives keyboard users an on-brand first stop.
```css
.skip { position: absolute; left: 1rem; top: -3rem; background: rgb(96 165 250 / .32); color: var(--text); padding: .25rem .5rem; border-radius: 3px; font: .75rem var(--mono); text-decoration: none; }
.skip:focus { top: 1rem; }
```
**Caveats.** There are only about 5 Tab stops before `<main>`, and the main landmark already lets screen readers jump past the header. If added, give `<main>` an `id="content"`.

### 30. Bigger touch targets for nav links
**What and why.** Vercel asks for touch targets of at least 44px on mobile ([guidelines](https://github.com/vercel-labs/web-interface-guidelines)). Nav links are about 20px tall on a phone.
```css
@media (pointer: coarse) { nav a { padding: .75rem .3rem; margin: -.75rem -.3rem; } }
```
**Caveats.** Keep only this rule. `-webkit-tap-highlight-color: transparent` removes iOS's only tap feedback, and `touch-action: manipulation` does nothing with `width=device-width`. The padding trick works because `nav` is a flex container.

## 4. Considered and skipped

- **Model-card length fact on every post.** It clutters the facts row; the colophon (#15) explains the tokenizer once.
- **"← Notes" back link.** It duplicates the site-name link and #20, and adds chrome above the h1 that the #5 morph would have to work around.
- **Tokenized row titles on hover.** It dilutes the intro's signature moment and conflicts with #16.
- **Short/long system-prompt toggle.** Medium effort, and it doubles copy that gets rewritten whenever life changes.
- **Reading progress in tokens.** Posts are about 1k tokens, so this is unnecessary fixed chrome.
- **Generation caret on the system prompt.** It reads as terminal or chat UI, and a system prompt is model input, not output.
- **Staggered homepage entrance.** A generic portfolio fade-up that delays the Notes list and competes with #3 and #18.
- **Section numbers as heading permalinks.** None of the posts has an h2 yet, and it would need a rehype plugin.
- **Dot leaders between title and token count.** A printed-index look the brief rules out.
- **`text-box-trim` on badges.** A pixel of gain, and it only works in Chrome and Safari.
- **"seedling" shimmer.** An infinite animation fails WCAG 2.2.2, and there are no seedling posts.
- **`scale(.97)` press feedback.** The site has no buttons, and iOS doesn't apply `:active` without a touch listener.
- **Live local-time line with a decode effect.** A JS interval gimmick on a zero-JS site.
