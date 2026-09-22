import ollama from "ollama";
import { EMBEDDING_MODEL, MODEL_NAME } from "../config/constants.js";
import type { Similarity } from "../types/type.js";

export async function embeddings(input: string): Promise<number[]> {
  const response = await ollama.embed({
    model: EMBEDDING_MODEL,
    input,
  });
  return response.embeddings[0] ?? [];
}

export function sorting(arr: Similarity[]): Similarity[] {
  return [...arr].sort((a, b) => b.similarity - a.similarity);
}

export function createContext(topk: Similarity[]): string {
  let context = "";
  for (const item of topk) {
    context += item.content;
  }
  return context;
}

export async function callModel(question: string, context: string) {
  const response = await ollama.generate({
    model: MODEL_NAME,
    prompt: createPrompt(context.replace("/r/n", ""), question),
  });
  return response;
}

function createPrompt(context: string, question: string): string {
  return `INSTRUCTION
Use the provided context to answer the question.
If the answer isn't present in the context, say that you don't know.
CONTEXT
${context}
QUESTION
${question}
`;
}
