import fs from "node:fs/promises";
import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

export async function readPdfs(fileName: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "data", "documents", fileName);
    const dataBuffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    return pdfData.text;
  } catch (err) {
    throw err;
  }
}


export async function readTxtDocument(fileName: string): Promise<string> {
  const filePath = path.join(process.cwd(), "data", "documents", fileName);

  return await readFile(filePath, "utf-8");
}
