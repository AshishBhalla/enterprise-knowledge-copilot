import type { Chunk, IndexedChunk } from "../../types/type.js";
import { embeddings } from "../../utils/utlis.js";

export async function createEmbeddings(
  input: Chunk[],
): Promise<IndexedChunk[]> {
  const chunkArray = input;
  const indexedChunk: IndexedChunk[] = [];
  for (const chunk of chunkArray) {
    const embedding = await embeddings(chunk.content);
    indexedChunk.push({
      chunkId: chunk.chunkId,
      fileName: chunk.fileName,
      metadata: chunk.metadata,
      content: chunk.content,
      embedding,
    });
  }
  return indexedChunk;
}
