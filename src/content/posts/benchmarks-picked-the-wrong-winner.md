---
title: "The leaderboard picked the wrong winner"
description: "Qwen 3.6 beat Gemma 4 on every benchmark. On real clinical notes, Gemma 4 won."
planted: 2026-10-10T12:00
stage: budding
tags: [learnings]
---

I needed a model to summarize clinical notes. The obvious move was to check the benchmarks and take the winner.

Qwen 3.6 beat Gemma 4 on every task and every benchmark. On paper, it wasn't close.

Then I ran both on the job I actually needed done, summarizing real clinical notes, and **Gemma 4 won.**

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

Benchmarks hand you a result to accept. Your own experiments are where you find out whether it's true. Before trusting a leaderboard, run the models on a slice of your own data.

Related: [which model to use when](/posts/which-model-when).
