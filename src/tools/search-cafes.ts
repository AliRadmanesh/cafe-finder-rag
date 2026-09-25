import { embed, cosineSimilarity, tool } from "ai";
import { z } from "zod";
import { embeddingModel } from "../model";
import type { Cafe } from "../types";

interface IndexEntry {
  id: string;
  embedding: number[];
}

const cafes: Cafe[] = await Bun.file("data/cafes.json").json();
const index: IndexEntry[] = await Bun.file("data/cafes.embeddings.json").json();
const cafeById = new Map(cafes.map((cafe) => [cafe.id, cafe]));

const DEFAULT_TOP_K = 3;

export async function searchCafes(query: string, topK = DEFAULT_TOP_K) {
  const { embedding: queryVector } = await embed({
    model: embeddingModel,
    value: query,
  });

  return index
    .map((entry) => ({
      id: entry.id,
      score: cosineSimilarity(queryVector, entry.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ id, score }) => ({ ...cafeById.get(id)!, score }));
}

export const tools = {
  search_cafes: tool({
    description: `Search the cafe by meaning. Use for any request about
        finding or recommending a cafe in Tehran (vibe, food, place, occasion).
        Returns the best matching cafes with a similarity score.`,
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "What the user is looking for, as a short natural-language description",
        ),
      topK: z
        .number()
        .int()
        .min(1)
        .max(10)
        .optional()
        .describe("How many cafes to return (default 3)"),
    }),
    execute: async ({ query, topK }) => searchCafes(query, topK),
  }),
};
