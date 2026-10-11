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

<figure class="fig fig-swap">
  <div class="swap-head">
    <input type="checkbox" id="swap-eval" class="swap-toggle" aria-describedby="swap-caption" />
    <label for="swap-eval" class="swap-switch"><span class="swap-a">public benchmarks</span><span class="swap-b">real clinical notes</span></label>
  </div>
  <ol class="swap-ranks">
    <li class="swap-qwen"><span class="swap-rank" aria-hidden="true"></span><span class="swap-name">Qwen 3.6</span><span class="fig-badge swap-badge-a">wins every task</span></li>
    <li class="swap-gemma"><span class="swap-rank" aria-hidden="true"></span><span class="swap-name">Gemma 4</span><span class="fig-badge swap-badge-b">wins</span></li>
  </ol>
  <figcaption id="swap-caption">Flip the eval set. Same two models, opposite ranking: the benchmark winner lost on the task that mattered.</figcaption>
</figure>

Benchmarks hand you a result to accept. Your own experiments are where you find out whether it's true. Before trusting a leaderboard, run the models on a slice of your own data.

Related: [which model to use when](/posts/which-model-when).
