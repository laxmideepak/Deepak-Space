---
title: "Instruct model or smart model?"
description: "My rule of thumb for choosing an LLM for clinical notes, after testing summarization and extraction."
planted: 2026-10-10T10:00
stage: budding
tags: [learnings]
---

After testing models on two jobs, [summarizing clinical notes](/posts/benchmarks-picked-the-wrong-winner) and [extracting smoking status](/posts/smarter-model-for-extraction), here's where I've landed, for now:

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

Smart models cost more and run slower. Spend that only on the tasks that need it.
