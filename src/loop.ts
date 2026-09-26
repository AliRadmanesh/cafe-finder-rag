import { generateText, stepCountIs, type ModelMessage } from "ai";
import { chatModel } from "./model";
import { tools } from "./tools/search-cafes";

const MAX_STEPS = 5;

const SYSTEM_PROMPT = `You are a friendly cafe recommender for Tehran.

- When the user asks for a cafe, recommendation, or place to go, call the
  search_cafes tool first. Never recommend a cafe that did not come from
  the tool results.
- The cafe data is in Persian. Reply in the language the user wrote in,
  and keep cafe names as they appear in the data.
- Recommend 1-3 cafes from the results, and say briefly why each fits.
- If the results do not fit the request well, say so honestly instead of
  forcing a match.
- If the user is not asking about cafes, answer normally without the tool.`;

export async function runTurn(messages: ModelMessage[]) {
  const result = await generateText({
    model: chatModel,
    instructions: SYSTEM_PROMPT,
    messages,
    tools,
    stopWhen: stepCountIs(MAX_STEPS),
  });

  for (const step of result.steps) {
    for (const call of step.toolCalls) {
      console.log(`  [tool] ${call.toolName}`, JSON.stringify(call.input));
    }
  }

  return result;
}
