import { readdir } from "node:fs/promises";
import type { Docs, Chunk, IndexedChunk } from "../types/type.js";
import { createChunkDocuments } from "../features/chunking/createChunk.js";
import { createEmbeddings } from "../features/embeddings/createEmbeddings.js";
import { readTxtDocument, readPdfs } from "../utils/readFileUtils.js";
import { normalizeContent } from "../utils/normalizeContent.js";
import { processMetadata } from "../features/metadata/processMetdata.js";

export async function runDataPipeline(
  folderPath: string,
): Promise<IndexedChunk[]> {
  try {
    const documents: Docs[] = [];
    const fileNames: string[] = await readdir(folderPath);
    for (const fileName of fileNames) {
      const content: string = fileName.includes("txt")
        ? await readTxtDocument(fileName)
        : await readPdfs(fileName);
      const normalizedText = normalizeContent(content);
      const contentArray = normalizedText.split("\n");
      const metadata = processMetadata(contentArray)
      documents.push({
        fileName,
        content: normalizedText,
        metadata,
      });
    }
    const chunkDocuments: Chunk[] = await createChunkDocuments(documents);

    const embededDocuments: IndexedChunk[] =
      await createEmbeddings(chunkDocuments);
    return embededDocuments;
  } catch (err) {
    console.error("Error Processing  Data:", err);
    throw err;
  }
}
