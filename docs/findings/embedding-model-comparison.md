# Finding: choosing a multilingual embedding model

**Date**: 2026-09-25 · **Decision**: use `baai/bge-m3` (via OpenRouter) as
the only embedding model in this project.

## Problem

Our corpus (`data/cafes.json`) is Persian, and queries may be English or
Persian. Step 4's sanity check with the design's original model,
`openai/text-embedding-3-small`, gave:

```
EN vs FA same meaning  0.141
EN vs unrelated        0.259   <- higher than the same-meaning pair
```

Same-language pairs were fine (English "quiet cafe to work in" vs "calm
coffee shop for studying" scored 0.73), so the code was correct. The model
simply doesn't align English and Persian well, and retrieval across
languages would be effectively random.

## Experiment

`scripts/compare-embedding-models.ts` embeds three strings with each
candidate and compares cosine similarity:

- `a quiet cafe to work in`
- `کافه‌ای آرام برای کار کردن` (same meaning, Persian)
- `a loud football bar` (unrelated)

Run: `bun run scripts/compare-embedding-models.ts`

## Results

| Model | Dim | Same meaning | Unrelated | Gap |
|---|---|---|---|---|
| openai/text-embedding-3-small | 1536 | 0.141 | 0.259 | **−0.118 (FAIL)** |
| openai/text-embedding-3-large | 3072 | 0.590 | 0.327 | +0.263 |
| **baai/bge-m3** | 1024 | 0.928 | 0.538 | **+0.390** |
| qwen/qwen3-embedding-8b | 4096 | 0.887 | 0.602 | +0.285 |
| google/gemini-embedding-001 | 3072 | 0.839 | 0.640 | +0.199 |
| intfloat/multilingual-e5-large | 1024 | 0.917 | 0.788 | +0.129 |

## How to read it

- **Gap matters, not the absolute score.** Different models use different
  similarity ranges. `multilingual-e5-large` scores 0.917 on the
  same-meaning pair but also 0.788 on the unrelated one, so it separates
  poorly. Retrieval works by ranking, so the gap is what counts.
- **`bge-m3` wins** on the widest gap, and it is also the smallest and
  cheapest to store (1024 dimensions).

## Caveats

A 3-string test is a quick screen, not a benchmark. The real check is the
retrieval eval in step 9, which measures whether the right cafe comes back
for real queries. If that shows problems, revisit this choice.

## Decision

`OPENROUTER_EMBEDDING_MODEL=baai/bge-m3` in `.env` and `.env.example`.
The comparison script stays in the repo as a record. Nothing else in the
project references the other models.
