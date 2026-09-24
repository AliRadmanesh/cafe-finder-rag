# Cafe Finder RAG — Learning Plan

How this works: each step below gets its own write-up in `docs/steps/`,
created as we complete it. I give you the exact code for that step, you
type/paste it in, I explain what it does and how it ties back to the
reference project, then you run it and we verify together before moving
on. Ask questions any time — we don't move to the next step until the
current one checks out.

See `docs/design.md` for the overall architecture this plan builds toward.

**Stack note:** built on the Vercel AI SDK (`ai` + `@ai-sdk/openai`), not
the raw `openai` package — see `docs/design.md`'s "Stack" section for why.

## Steps

- [x] **Step 1 — Project setup.** `bun init`, install `ai`, `@ai-sdk/openai`,
      `zod`, `dotenv`; folder skeleton, `.gitignore`, `tsconfig`. _Concept:
      project scaffolding for a Bun/TS CLI tool._
- [ ] **Step 2 — Env + connectivity check.** `.env` with the OpenRouter vars,
      `src/model.ts` (the `createOpenAI` provider setup), a tiny script that
      makes one `generateText` call and prints the response. _Concept:
      OpenRouter as an OpenAI-compatible endpoint, AI SDK provider objects._
- [ ] **Step 3 — Seed data.** Review `data/cafes.json` (Tehran cafes,
      provided as data rather than typed by hand). _Concept: what a
      retrieval corpus looks like before it's embedded._
- [ ] **Step 4 — Embeddings sanity check.** A tiny script using `embed()` on
      one string, print the vector's shape. _Concept: what an embedding
      actually is, the AI SDK's `embed()` shape._
- [ ] **Step 5 — Full embed script.** `scripts/embed-cafes.ts`: `embedMany()`
      over every cafe in one call, write `data/cafes.embeddings.json`. Run
      it, inspect the output. _Concept: precomputing a vector index instead
      of a live DB._
- [ ] **Step 6 — The `search_cafes` tool.** `src/tools/search-cafes.ts`:
      `tool()` + Zod schema, `embed()` the query, rank with the built-in
      `cosineSimilarity()`, return top-k; export the `tools` object.
      _Concept: retrieval step of RAG end to end, AI SDK tool definitions._
- [ ] **Step 7 — The tool-calling loop.** `src/loop.ts` (`runTurn`): one
      `generateText` call with `tools` + `stopWhen: stepCountIs(N)` — the
      SDK runs the multi-step loop internally. _Concept: how AI SDK's
      built-in agent loop replaces the hand-rolled one in the raw-SDK
      reference._
- [ ] **Step 8 — The CLI agent.** `src/agent.ts`, run it end to end with a
      real query. _Concept: wiring the REPL to the loop, `ModelMessage[]`
      history._
- [ ] **Step 9 — Retrieval eval.** `src/eval/cases.ts` + `src/eval/eval.ts`,
      run and verify it passes. _Concept: testing RAG retrieval quality in
      isolation from generation._

## Progress log

(filled in as we go — one line per completed step, date + anything notable)
- 2026-09-24 — Step 1 done. Installed ai@7.0.113, @ai-sdk/openai@4.0.74, zod@4.6.5. `bun init` generated its own .gitignore (already covers .env).
