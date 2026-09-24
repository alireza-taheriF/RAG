import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chunkDocuments } from "@/rag/chunk";
import { corpus } from "@/rag/corpus";
import { goldSet } from "@/rag/gold";

const dataDir = path.join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });

const chunks = chunkDocuments(corpus).map((chunk) => ({
  id: chunk.id,
  docId: chunk.docId,
  title: chunk.title,
  index: chunk.index,
  text: chunk.text,
}));

for (const chunk of chunks) {
  if (chunk.id !== `${chunk.docId}#${chunk.index}`) {
    throw new Error(`unstable chunk id ${chunk.id}`);
  }
}

writeFileSync(path.join(dataDir, "chunks.json"), `${JSON.stringify(chunks, null, 2)}\n`);
writeFileSync(path.join(dataDir, "gold.json"), `${JSON.stringify(goldSet, null, 2)}\n`);

console.log(`wrote ${chunks.length} chunks and ${goldSet.length} gold questions to data/`);
