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
- [x] **Step 2 — Env + connectivity check.** `.env` with the OpenRouter vars,
      `src/model.ts` (the `createOpenAI` provider setup), a tiny script that
      makes one `generateText` call and prints the response. _Concept:
      OpenRouter as an OpenAI-compatible endpoint, AI SDK provider objects._
- [x] **Step 3 — Seed data.** Review `data/cafes.json` (Tehran cafes,
      provided as data rather than typed by hand). _Concept: what a
      retrieval corpus looks like before it's embedded._
- [x] **Step 4 — Embeddings sanity check.** A tiny script using `embed()` on
      one string, print the vector's shape. _Concept: what an embedding
      actually is, the AI SDK's `embed()` shape._
- [x] **Step 5 — Full embed script.** `scripts/embed-cafes.ts`: `embedMany()`
      over every cafe in one call, write `data/cafes.embeddings.json`. Run
      it, inspect the output. _Concept: precomputing a vector index instead
      of a live DB._
- [x] **Step 6 — The `search_cafes` tool.** `src/tools/search-cafes.ts`:
      `tool()` + Zod schema, `embed()` the query, rank with the built-in
      `cosineSimilarity()`, return top-k; export the `tools` object.
      _Concept: retrieval step of RAG end to end, AI SDK tool definitions._
- [x] **Step 7 — The tool-calling loop.** `src/loop.ts` (`runTurn`): one
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
- 2026-09-24 — Step 2 done. ping.ts returned a Persian greeting via OpenRouter (gpt-4.1-nano, 20 tokens). .env.example committed; .env gitignored.
- 2026-09-24 — Step 3 done. 25 real Tehran cafes, Persian descriptions. Schema slimmed to id/name/neighborhood/address/description (dropped tags/goodFor/priceRange so retrieval does the inferring).
- 2026-09-25 — Step 4 finding: text-embedding-3-small failed cross-language (EN vs FA) check; compared 6 models, switched to baai/bge-m3. Write-up in docs/findings/embedding-model-comparison.md.
- 2026-09-25 — Step 4 done. bge-m3: 1024 dims, EN/FA same-meaning 0.928 vs unrelated 0.538.
- 2026-09-25 — Step 5 done. 25 vectors x 1024 dims in data/cafes.embeddings.json (531K, 2056 tokens).
- 2026-09-25 — Step 6 done. Retrieval sensible on 4 queries; noted cafe-nadir missing from top 3 for a history query (eval candidate).
- 2026-09-26 — Step 7 done. runTurn works: model writes its own Persian search queries, skips tool for non-cafe questions, history threading via result.responseMessages resolves follow-ups.
