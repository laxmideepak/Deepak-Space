---
title: "For extraction, the smarter model earned its keep"
description: "Pulling smoking status out of raw EHR notes: Qwen 3.8 vs Gemma 4, and what the disagreements showed."
planted: 2026-10-10T11:00
stage: budding
tags: [learnings]
---

Summarizing a note is one job. Pulling one specific fact out of it is another. My test case: smoking status, from raw EHR notes.

This time **Qwen 3.8 outperformed Gemma 4.**

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

Agreement between two models tells you where the easy cases are. The disagreements are where you learn which model actually understands the task, so that's where to spend your manual review time.

Related: [which model to use when](/posts/which-model-when).
