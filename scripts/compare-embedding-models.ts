import { createOpenAI } from "@ai-sdk/openai";
import { embedMany, cosineSimilarity } from "ai";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: process.env.OPENROUTER_BASE_URL!,
});

const models = [
  "openai/text-embedding-3-small", // baseline
  "openai/text-embedding-3-large",
  "baai/bge-m3",
  "qwen/qwen3-embedding-8b",
  "google/gemini-embedding-001",
  "intfloat/multilingual-e5-large",
];

const values = [
  "a quiet cafe to work in",
  "کافه‌ای آرام برای کار کردن",
  "a loud football bar",
];

for (const id of models) {
  try {
    const { embeddings: e, usage: u } = await embedMany({
      model: openrouter.embedding(id),
      values,
    });
    const same = cosineSimilarity(e[0]!, e[1]!);
    const unrelated = cosineSimilarity(e[0]!, e[2]!);
    console.log(
      id.padEnd(34),
      `dim=${e[0]!.length}`.padEnd(10),
      `same-meaning=${same.toFixed(3)}`,
      `unrelated=${unrelated.toFixed(3)}`,
      same > unrelated ? "OK" : "FAIL",
    );
    console.log("usage: ", u);
  } catch (err) {
    console.log(id.padEnd(34), "ERROR", String(err).slice(0, 100));
  }
}
