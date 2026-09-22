import cosineSimilarity from "./similarity.js";
import type { IndexedChunk, Similarity } from "../../types/type.js";

export async function checkSimilarity(
  datastore: IndexedChunk[],
  userEmbedding: number[],
): Promise<Similarity[]> {
  const scoredArray: Similarity[] = [];
  for (const item of datastore) {
    const similarityScore = cosineSimilarity(item.embedding, userEmbedding);
    scoredArray.push({
      chunkId: item.chunkId,
      content: item.content,
      similarity: similarityScore,
    });
  }
  return scoredArray;
}
