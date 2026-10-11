---
title: "Don’t send the whole note"
description: "Extracting one fact from EHR notes? Send only the part that mentions it. A regex window can cut LLM costs by about 70–80%."
planted: 2026-10-10T09:00
stage: budding
tags: [learnings]
---

The biggest win in my extraction work wasn't a model at all.

To extract one thing, you don't need to send the entire raw note to an LLM. Send only the part that talks about it. That can cut costs by **about 70–80%.**

For smoking, the pipeline looks like this:

1. Search every note for smoking and tobacco words with a regex.
2. In the notes that match, find where those words appear.
3. Take a window of about ±150 tokens around each match.
4. Send only that window to the LLM.

<figure class="fig">
  <p class="fig-note-text">
    <span class="out">Pt seen for follow-up of hypertension. BP stable on current meds. Denies chest pain or SOB. Labs reviewed, A1c within range.</span>
    <span class="in">Social history: former smoker, quit <mark>tobacco</mark> several years ago. Lives with spouse, walks daily.</span>
    <span class="out">Plan: continue current meds, recheck labs in 3 months, return sooner if symptoms change.</span>
  </p>
  <div class="fig-legend"><span class="key-in">sent to the LLM</span><span class="key-out">never sent</span></div>
  <div class="fig-cost" role="img" aria-label="Tokens sent: whole note 100%, window only about 25%">
    <div class="fig-cost-row"><span>Whole note</span><div class="fig-cost-bar" style="--w: 100%"></div><span class="fig-cost-val">100%</span></div>
    <div class="fig-cost-row"><span>Window only</span><div class="fig-cost-bar is-accent" style="--w: 25%"></div><span class="fig-cost-val">~25%</span></div>
  </div>
  <figcaption>A made-up example note. Only the window around the matched word goes to the model, which can cut costs by about 70–80%.</figcaption>
</figure>

Cheap filtering first, expensive model last. The LLM only sees text that could contain the answer.
