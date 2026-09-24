import { pageMarkerRegex } from "../config/constants.js";

export function normalizeContent(rawContent: string): string {
  rawContent = rawContent.replaceAll("\r\n", "\n");
  rawContent = rawContent.replaceAll("\r", "\n");
  rawContent = rawContent.replaceAll(pageMarkerRegex, "");
  return rawContent;
}
