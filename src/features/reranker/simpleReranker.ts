import { Similarity, Reranked } from "../../types/type.js";
import { sorting } from "../../utils/utlis.js";
import { RELEVANCE_SCORE } from "../../config/constants.js";

export function reranker(
  candidates: Similarity[],
  question: string,
): Reranked[] {
  const questionArray = question.split(" ");
  const reankedArray = [];
  for (const candidate of candidates) {
    let relevanceScore = 0;
    for (const item of questionArray) {
      if (candidate.content.toLowerCase().includes(item.toLowerCase())) {
        relevanceScore += 1;
      }
    }
    reankedArray.push({ ...candidate, relevanceScore });
  }
  const sortedRerankedArray = sorting(reankedArray, RELEVANCE_SCORE);
  return sortedRerankedArray;
}
