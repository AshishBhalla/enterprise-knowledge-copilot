import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { Docs, MetaData, Chunk, IndexedChunk } from "./type.js";
import { createChunkDocuments } from "./createChunk.js";
import { createEmbeddings } from "./createEmbeddings.js";

export async function runDataPipeline(folderPath: string): Promise<IndexedChunk[]> {
  try {
    const documents: Docs[] = [];
    const fileNames: string[] = await readdir(folderPath);
    for (const fileName of fileNames) {
      const metadata: MetaData = { title: "", department: "", region: "" };
      const content: string = await readDocument(fileName);
      const contentArray = content.split("\r\n");
      for (const item of contentArray) {
        if (
          item.includes("title") ||
          item.includes("Title") ||
          item.includes("department") ||
          item.includes("Department") ||
          item.includes("region") ||
          item.includes("Region")
        ) {
          const data = item.split(":");
          if (data[0] && data[1]) {
            if (
              data[0] === "title" ||
              data[0] === "Title" ||
              data[0] === "department" ||
              data[0] === "Department" ||
              data[0] === "region" ||
              data[0] === "Region"
            ) {
              const key = data[0].toLowerCase() as keyof MetaData;
              metadata[key] = data[1]?.trim();
            }
          }
        }
      }
      documents.push({
        fileName,
        content,
        metadata,
      });
    }
    const chunkDocuments: Chunk[] = await createChunkDocuments(documents);

    const embededDocuments: IndexedChunk[] =
      await createEmbeddings(chunkDocuments);

    console.log(embededDocuments);
    return embededDocuments;
  } catch (err) {
    console.error("Error Processing  Data:", err);
    throw err;
  }
}

async function readDocument(fileName: string): Promise<string> {
  const filePath = path.join(process.cwd(), "data", "documents", fileName);

  return await readFile(filePath, "utf-8");
}
