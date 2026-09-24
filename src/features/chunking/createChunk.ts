import type { Docs, Chunk } from "../../types/type.js";

function isPdf(fileName: string): boolean {
  return fileName.toLowerCase().endsWith(".pdf");
}

function isHeading(line: string): boolean {

  const knownHeadings = [
    "Purpose",
    "Claim notification",
    "Initial validation",
    "Common documents",
    "Assessment and investigation",
    "Decision and communication",
    "Escalation",
    "Controls",
  ];

  const normalizedLine = line.trim().toLowerCase();

  return knownHeadings.some(
    (heading) => heading.toLowerCase() === normalizedLine
  );
}

function cleanLines(content: string): string[] {
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;

      // Remove PDF page markers
      if (/^--\s*\d+\s+of\s+\d+\s*--$/.test(line)) {
        return false;
      }

      return true;
    });
}

export async function createChunkDocuments(
  documents: Docs[],
): Promise<Chunk[]> {

  const chunkedDocuments: Chunk[] = [];
  let chunkId = 0;

  for (const document of documents) {

    // PDF processing
    if (isPdf(document.fileName)) {

      const lines = cleanLines(document.content);

      let currentSection: string[] = [];

      for (const line of lines) {

        // Start a new section when a heading is detected
        if (
          isHeading(line) &&
          currentSection.length > 0
        ) {

          const sectionContent = currentSection.join("\n").trim();

          if (sectionContent.length > 0) {
            chunkedDocuments.push({
              chunkId: chunkId++,
              fileName: document.fileName,
              metadata: document.metadata,
              content: sectionContent,
            });
          }

          currentSection = [];
        }

        currentSection.push(line);
      }

      // Add the final PDF section
      const finalSection = currentSection.join("\n").trim();

      if (finalSection.length > 0) {
        chunkedDocuments.push({
          chunkId: chunkId++,
          fileName: document.fileName,
          metadata: document.metadata,
          content: finalSection,
        });
      }

    } else {

      // TXT processing: preserve your existing blank-line approach
      const documentsArray = document.content
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split(/\n\s*\n/)
        .map((chunk) => chunk.trim())
        .filter((chunk) => chunk.length > 0);

      for (const chunk of documentsArray) {

        chunkedDocuments.push({
          chunkId: chunkId++,
          fileName: document.fileName,
          metadata: document.metadata,
          content: chunk,
        });
      }
    }
  }

  return chunkedDocuments;
}