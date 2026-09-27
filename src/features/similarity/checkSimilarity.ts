import cosineSimilarity from "./similarity.js";
import type { IndexedChunk, Similarity, User } from "../../types/type.js";
import { DEFAULT_DEPARTMENT, DEFAULT_REGION } from "../../config/constants.js";

export async function checkSimilarity(
  datastore: IndexedChunk[],
  userEmbedding: number[],
  userAccess: User,
): Promise<Similarity[]> {
  const scoredArray: Similarity[] = [];
  for (const item of datastore) {
    if (
      (item.metadata.department === userAccess.department &&
        item.metadata.region === userAccess.region) ||
      (item.metadata.department === DEFAULT_DEPARTMENT &&
        item.metadata.region === DEFAULT_REGION)
    ) {
      // console.log("Selected item", item.content, item.content);
      const similarityScore = cosineSimilarity(item.embedding, userEmbedding);
      scoredArray.push({
        chunkId: item.chunkId,
        content: item.content,
        similarity: similarityScore,
        source: item.fileName,
      });
    }
  }
  return scoredArray;
}
