import { IndexedChunk, Keyword } from "../../types/type.js";
import { filterStopWords } from "../../utils/filterStopWords.js";
import { sorting } from "../../utils/utlis.js";
import { MATCHES } from "../../config/constants.js";

export function performKeywordSearch(
  datastore: IndexedChunk[],
  question: string,
): Keyword[] {
  const filteredQuestion = filterStopWords(question);
  const filteredQuestionArray = filteredQuestion.split(" ");
  const keywords = [];
  for (const item of datastore) {
    let matches = 0;
    for (const word of filteredQuestionArray) {
      if (item.content.toLowerCase().includes(word.toLowerCase())) {
        matches += 1;
      }
    }
    keywords.push({
      chunkId: item.chunkId,
      content: item.content,
      matches,
      source: item.fileName,
    });
  }
  return sorting(keywords, MATCHES);
}
