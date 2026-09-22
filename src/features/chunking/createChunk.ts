import type { Docs, Chunk } from "../../types/type.js";

export async function createChunkDocuments(
  documents: Docs[],
): Promise<Chunk[]> {
  const originalDocuments: Docs[] = documents;
  let chunkId = 0;
  let documentsArray = [];
  const chunkedDocuments: Chunk[] = [];
  for (const document of originalDocuments) {
    documentsArray = document.content.split(/\n\s*\n/);
    for (const chunk of documentsArray) {
      if (chunk.includes(":")) continue;
      chunkedDocuments.push({
        chunkId: chunkId++,
        fileName: document.fileName,
        metadata: document.metadata,
        content: chunk,
      });
    }
  }
  return chunkedDocuments;
}
