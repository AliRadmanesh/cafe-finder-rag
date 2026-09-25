import { embedMany, cosineSimilarity } from "ai";
import { embeddingModel } from "../src/model";

const { embeddings, usage } = await embedMany({
  model: embeddingModel,
  values: [
    "a quiet cafe to work in",
    "کافه‌ای آرام برای کار کردن",
    "a loud football bar",
  ],
});

console.log(
  "EN vs FA same meaning",
  cosineSimilarity(embeddings[0]!, embeddings[1]!),
);
console.log(
  "EN vs unrelated:     ",
  cosineSimilarity(embeddings[0]!, embeddings[2]!),
);
console.log("usage: ", usage);
