import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import type { IndexedChunk, Similarity } from "./type.js";
import { embeddings } from "./utlis.js";
import { runDataPipeline } from "./dataPipeline.js";
import { checkSimilarity } from "./checkSimilarity.js";
import { sorting } from "./utlis.js";
import { topK } from "./topk.js";
import { createContext } from "./utlis.js";
import { callModel } from "./utlis.js";

const rl = readline.createInterface({ input, output });

async function readDir(folderPath: string): Promise<void> {
  let embededDocuments: IndexedChunk[] = [];
  try {
    embededDocuments = await runDataPipeline(folderPath);
  } catch (err) {
    console.log("Error", err);
  }

  //   User Input processing
  console.log("🤖 AI Assistant:");
  while (true) {
    const userMessage: string = await rl.question("You: ");
    const userEmbedding: number[] = await embeddings(userMessage);
    const similarity: Similarity[] = await checkSimilarity(
      embededDocuments,
      userEmbedding,
    );
    const sortedBySimilarty = sorting(similarity);
    const context: string = createContext(topK(sortedBySimilarty));
    const llmResponse = await callModel(userMessage, context);
    console.log(`Bot: ${JSON.stringify(llmResponse.response)}`);
  }
}

const targetFolder = path.join(process.cwd(), "data", "documents");
readDir(targetFolder);
