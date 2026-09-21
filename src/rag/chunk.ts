import { tokenize } from "@/rag/tokenize";
import type { Chunk, CorpusDoc } from "@/rag/types";

const TARGET_WORDS = 90;
const OVERLAP_WORDS = 18;

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function chunkDocuments(docs: CorpusDoc[]): Chunk[] {
  const chunks: Chunk[] = [];
  for (const doc of docs) {
    const paragraphs = splitParagraphs(doc.text);
    let buffer: string[] = [];
    let index = 0;

    const flush = (force = false) => {
      const words = buffer.join(" ").split(/\s+/).filter(Boolean);
      if (words.length === 0) return;
      if (!force && words.length < TARGET_WORDS && buffer.length > 0) return;
      const text = words.join(" ");
      chunks.push({
        id: `${doc.id}#${index}`,
        docId: doc.id,
        title: doc.title,
        index,
        text,
        tokens: tokenize(text),
      });
      index += 1;
      if (OVERLAP_WORDS > 0 && words.length > OVERLAP_WORDS) {
        buffer = [words.slice(-OVERLAP_WORDS).join(" ")];
      } else {
        buffer = [];
      }
    };

    for (const para of paragraphs) {
      buffer.push(para);
      const words = buffer.join(" ").split(/\s+/).filter(Boolean);
      if (words.length >= TARGET_WORDS) flush(true);
    }
    flush(true);
  }
  return chunks;
}
