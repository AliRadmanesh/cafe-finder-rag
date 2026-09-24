import { generateText } from "ai";
import { chatModel } from "../src/model";

const { text, usage } = await generateText({
  model: chatModel,
  prompt: "Say hello in Persian, in one short sentence.",
});

console.log(text);
console.log(usage);
