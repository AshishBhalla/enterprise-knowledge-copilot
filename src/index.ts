import path from "node:path";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type {
  IndexedChunk,
  Similarity,
  User,
  Reranked,
  Keyword,
} from "./types/type.js";
import { embeddings } from "./utils/utlis.js";
import { runDataPipeline } from "./pipeline/dataPipeline.js";
import { checkSimilarity } from "./features/similarity/checkSimilarity.js";
import { sorting } from "./utils/utlis.js";
import { topK } from "./features/similarity/topk.js";
import { createContext } from "./utils/utlis.js";
import { callModel } from "./utils/utlis.js";
import { reranker } from "./features/reranker/simpleReranker.js";
import { SIMILARITY } from "./config/constants.js";
import { performKeywordSearch } from "./features/keywordSearch/keyword.js";

const rl = readline.createInterface({ input, output });

async function readDir(folderPath: string): Promise<void> {
  const similuatedUser: User = {
    user: "Ashish",
    department: "Sales",
    region: "Global",
  };
  let embededDocuments: IndexedChunk[] = [];
  try {
    embededDocuments = await runDataPipeline(folderPath);
  } catch (err) {
    throw err;
  }

  //   User Input processing
  console.log("🤖 AI Assistant:");
  while (true) {
    const userMessage: string = await rl.question("You: ");
    const userEmbedding: number[] = await embeddings(userMessage);
    const similarity: Similarity[] = await checkSimilarity(
      embededDocuments,
      userEmbedding,
      similuatedUser,
    );
    const sortedBySimilarty: Similarity[] = sorting(similarity, SIMILARITY);
    const top_k_vector: Similarity[] = topK(sortedBySimilarty);
    console.log("top_k_vector", top_k_vector);
    const keywordSearchCandidates = performKeywordSearch(
      embededDocuments,
      userMessage,
    );
    const top_k_keyword: Keyword[] = topK(keywordSearchCandidates);
    console.log('top_k_keyword', top_k_keyword)
    const seenChunkIds = new Set<number>();
    const uniqueCandidates = [...top_k_vector, ...top_k_keyword].filter(
      (item) => {
        if (seenChunkIds.has(item.chunkId)) return false;
        seenChunkIds.add(item.chunkId);
        return true;
      },
    );
    console.log('uniqueCandidates', uniqueCandidates)
    const top_n = reranker(
      uniqueCandidates,
      userMessage,
    );
    console.log("top-n", top_n);
    const context: string = createContext(top_n);
    const llmResponse = await callModel(userMessage, context);
    console.log(`Bot: ${JSON.stringify(llmResponse.response)}`);
  }
}

const targetFolder = path.join(process.cwd(), "data", "documents");
readDir(targetFolder);
