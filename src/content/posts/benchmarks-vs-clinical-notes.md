---
title: What benchmarks don't tell you about clinical notes
description: Four lessons from picking LLMs for real EHR work. Where the leaderboard misled me, when a smarter model is worth it, and a regex trick that cuts most of the cost.
planted: 2026-10-10
stage: budding
tags: [learnings]
---

I spend my days pointing LLMs at clinical notes. These are four things I wrote down in my notebook after choosing models for two jobs: summarizing notes, and pulling one specific fact out of them.

## The leaderboard picked the wrong winner

Qwen 3.6 beat Gemma 4 on every task and every benchmark. On paper, it wasn't close.

Then I ran both on the job I actually needed done, summarizing real clinical notes, and **Gemma 4 won.**

Benchmarks hand you a result to accept. Your own experiments are where you find out whether it's true.

<figure class="fig">
  <div class="fig-versus">
    <div class="fig-panel">
      <p class="fig-panel-title">Public benchmarks</p>
      <p class="fig-model is-winner"><span>Qwen 3.6</span><span class="fig-badge">wins every task</span></p>
      <p class="fig-model"><span>Gemma 4</span></p>
    </div>
    <div class="fig-panel">
      <p class="fig-panel-title">Summarizing real clinical notes</p>
      <p class="fig-model"><span>Qwen 3.6</span></p>
      <p class="fig-model is-winner"><span>Gemma 4</span><span class="fig-badge">wins</span></p>
    </div>
  </div>
  <figcaption>Same two models, opposite result. The benchmark winner lost on the task that mattered.</figcaption>
</figure>

## For extraction, the smarter model earned its keep

Next job: pull smoking status out of raw notes. This time **Qwen 3.8 outperformed Gemma 4.**

The two models agreed on 70–80% of the notes. The interesting part was the rest. When I read through some of those disagreements by hand, Qwen 3.8 was smart enough to pull out the right answer.

<figure class="fig">
  <div class="fig-bar" role="img" aria-label="Gemma 4 agreed with 70 to 80 percent of Qwen 3.8's answers">
    <div class="fig-bar-agree">agree</div>
    <div class="fig-bar-range"></div>
    <div class="fig-bar-rest">disagree</div>
  </div>
  <div class="fig-bar-scale"><span>0%</span><span>70–80%</span><span>100%</span></div>
  <p class="fig-note">In the disagreements I checked by hand, Qwen 3.8 had it right.</p>
  <figcaption>Smoking-status extraction: how often Gemma 4 matched Qwen 3.8. The shaded band is the 70–80% range.</figcaption>
</figure>

## My rule of thumb

Here's where I've landed, for now:

- **Summarizing?** A normal instruct model is enough.
- **Extracting something specific,** where you'd have to use your own brain to get it right? Go for the smart model.

<figure class="fig">
  <div class="fig-tree">
    <p class="fig-node is-root">What's the task?</p>
    <div class="fig-branches">
      <div class="fig-branch">
        <p class="fig-edge">Summarize a note</p>
        <p class="fig-node">Normal instruct model</p>
      </div>
      <div class="fig-branch">
        <p class="fig-edge">Extract one thing that takes judgment</p>
        <p class="fig-node is-accent">Smart model</p>
      </div>
    </div>
  </div>
  <figcaption>Pay for intelligence only where a human would have to think.</figcaption>
</figure>

## Don't send the whole note

The biggest win wasn't a model at all. To extract one thing, you don't need to send the entire raw note to an LLM. Send only the part that talks about it. That can cut costs by **about 70–80%.**

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
  <div class="fig-cost">
    <div class="fig-cost-row"><span>Whole note</span><div class="fig-cost-bar" style="--w: 100%"></div></div>
    <div class="fig-cost-row"><span>Window only</span><div class="fig-cost-bar is-accent" style="--w: 25%"></div></div>
  </div>
  <figcaption>A made-up example note. Only the window around the matched word goes to the model, which can cut costs by about 70–80%.</figcaption>
</figure>
