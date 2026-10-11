"""
Teacher-force a small open model on the homepage copy.

For every token of Deepak's reply, record what the model expected (its greedy
guess and top-5) given everything before it. Where the guess matches, the
homepage shows it as "predicted"; where it misses, that's the part of Deepak a
small model didn't see coming.

The text is Deepak's; the probabilities are the model's. Nothing is generated.

Setup: pip install -r scripts/requirements.txt
Run (about a minute on a laptop CPU, ~1 GB download the first time):
    python scripts/export_inference.py
Writes src/data/inference.json. Rerun whenever SYSTEM or REPLY changes.
"""

import json
import math
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL = "Qwen/Qwen2.5-0.5B-Instruct"

# Must match the system prompt rendered in src/pages/index.astro.
SYSTEM = (
    "You are Deepak, an ML engineer on the ML4H team at the Broad Institute. "
    "You are currently predicting late-life depression and stroke from longitudinal EHR notes, "
    "playing cricket, badminton and volleyball (always up for a game), "
    "and thinking about building consistency in life."
)

# Must match the decoded lines rendered on the homepage.
REPLY = [
    "I build models that read clinical notes.",
    "Off the clock: cricket, badminton, volleyball. Always up for a game.",
]

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "inference.json"


def main() -> None:
    tok = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModelForCausalLM.from_pretrained(MODEL, dtype=torch.float32)
    model.eval()

    prefix = tok.apply_chat_template(
        [{"role": "system", "content": SYSTEM}], tokenize=False, add_generation_prompt=True
    )
    reply = "\n".join(REPLY)
    full_ids = tok(prefix + reply, add_special_tokens=False).input_ids

    # Token spans inside the one sequence: the system prompt (read in prefill) and the reply (decoded).
    def span_end(text: str) -> int:
        ids = tok(text, add_special_tokens=False).input_ids
        assert full_ids[: len(ids)] == ids, f"{text[-30:]!r} must tokenize identically on its own"
        return len(ids)

    head = prefix[: prefix.index(SYSTEM)]  # "<|im_start|>system\n"
    system_span = range(span_end(head), span_end(head + SYSTEM))
    reply_span = range(span_end(prefix), len(full_ids))

    with torch.no_grad():
        logits = model(torch.tensor([full_ids])).logits[0]
    probs = torch.softmax(logits.float(), dim=-1)

    def score(span: range) -> list[dict]:
        out = []
        for pos in span:
            actual = full_ids[pos]
            dist = probs[pos - 1]
            top_p, top_i = dist.topk(5)
            p_actual = dist[actual].item()
            guess = top_i[0].item()
            out.append({
                "text": tok.decode([actual]),
                "p": round(p_actual, 4),
                "bits": round(-math.log2(max(p_actual, 1e-12)), 2),
                "hit": guess == actual,
                "guess": tok.decode([guess]),
                "top5": [[tok.decode([i.item()]), round(p.item(), 4)] for p, i in zip(top_p, top_i)],
            })
        return out

    system_tokens, tokens = score(system_span), score(reply_span)
    assert "".join(t["text"] for t in system_tokens) == SYSTEM
    assert "".join(t["text"] for t in tokens) == reply
    rate = lambda ts: round(sum(t["hit"] for t in ts) / len(ts), 2)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "model": MODEL,
        "layers": model.config.num_hidden_layers,
        "system": SYSTEM,
        "system_tokens": system_tokens,
        "system_alpha": rate(system_tokens),
        "lines": REPLY,
        "tokens": tokens,
        "alpha": rate(tokens),
    }, ensure_ascii=False, indent=1) + "\n")

    # Human-readable check: where does the model miss?
    for name, ts in (("system (prefill)", system_tokens), ("reply (decode)", tokens)):
        print(f"\n== {name}")
        for t in ts:
            mark = "  hit " if t["hit"] else "MISS  "
            print(f"{mark}{t['text']!r:18} p={t['p']:.3f} {t['bits']:5.1f} bits  guessed {t['guess']!r}")
        print(f"alpha = {rate(ts):.2f} ({sum(t['hit'] for t in ts)}/{len(ts)} predicted)")
    print(f"\n-> {OUT}")


if __name__ == "__main__":
    main()
