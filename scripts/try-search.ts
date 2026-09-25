import { searchCafes } from "../src/tools/search-cafes";

const queries = [
  "a quiet place to work on my laptop",
  "traditional cafe with history and old Tehran atmosphere",
  "cafe with a garden",
  "کافه‌ای با فضای سنتی و حیاط",
];

for (const q of queries) {
  console.log(`\n> ${q}`);
  for (const c of await searchCafes(q)) {
    console.log(`  ${c.score.toFixed(3)}  ${c.name} (${c.neighborhood})`);
  }
}
