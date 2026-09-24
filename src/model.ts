import { createOpenAI } from "@ai-sdk/openai";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

const openai = createOpenAI({
  apiKey: requireEnv("OPENROUTER_API_KEY"),
  baseURL: requireEnv("OPENROUTER_BASE_URL"),
});

export const chatModel = openai(requireEnv("OPENROUTER_MODEL"));
export const embeddingModel = openai(requireEnv("OPENROUTER_EMBEDDING_MODEL"));
