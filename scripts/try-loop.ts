import type { ModelMessage } from "ai";
import { runTurn } from "../src/loop";

const messages: ModelMessage[] = [];

async function ask(text: string) {
  console.log(`\nYou: ${text}`);
  messages.push({ role: "user", content: text });
  const result = await runTurn(messages);
  messages.push(...result.responseMessages);
  console.log(`\nBot: ${result.text}`);
  console.log(`  (${result.steps.length} step(s))`);
}

await ask("I need a quiet place to work on my laptop");
await ask("what about one with a garden instead?");
await ask("waht is 2 + 2?");
