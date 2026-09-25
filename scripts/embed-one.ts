import { embed } from "ai";
import { embeddingModel } from "../src/model";

const { embedding, usage } = await embed({
  model: embeddingModel,
  value: "a quiet cafe to work in",
});

console.log("dimensions: ", embedding.length);
console.log("first five values: ", embedding.slice(0, 5));
console.log("usage: ", usage);
