import { embedMany } from "ai";
import { embeddingModel } from "../src/model";

interface Cafe {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  description: string;
}

const cafes: Cafe[] = await Bun.file("data/cafes.json").json();

const { embeddings, usage } = await embedMany({
  model: embeddingModel,
  values: cafes.map((c) => c.description),
});

const index = cafes.map((c, i) => ({ id: c.id, embedding: embeddings[i]! }));

await Bun.write("data/cafes.embeddings.json", JSON.stringify(index));

console.log(
  `embedded ${index.length} cafes, ${index[0]!.embedding.length} dims`,
);
console.log("usage: ", usage);
